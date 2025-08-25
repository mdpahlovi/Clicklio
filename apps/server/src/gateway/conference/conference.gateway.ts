import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import * as mediasoup from "mediasoup";
import { Server, Socket } from "socket.io";

type RouteData = {
    router: mediasoup.types.Router;
    transports: Map<string, mediasoup.types.WebRtcTransport>;
};

type ConnectTransportPayload = {
    room: string;
    transportId: string;
    dtlsParameters: mediasoup.types.DtlsParameters;
};

type ProducePayload = {
    room: string;
    transportId: string;
    kind: mediasoup.types.MediaKind;
    rtpParameters: mediasoup.types.RtpParameters;
    appData?: mediasoup.types.AppData;
};

type ConsumePayload = {
    room: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: mediasoup.types.RtpCapabilities;
};

type ResumeConsumerPayload = {
    room: string;
    consumerId: string;
};

@WebSocketGateway({ cors: { origin: "*" } })
export class ConferenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ConferenceGateway.name);
    private worker?: mediasoup.types.Worker;
    private routers: Map<string, RouteData> = new Map();

    // Add these new Maps
    private producers: Map<string, mediasoup.types.Producer> = new Map();
    private consumers: Map<string, mediasoup.types.Consumer> = new Map();
    private clientRooms: Map<string, string> = new Map(); // clientId -> roomId

    @WebSocketServer() server: Server;

    async handleConnection(client: Socket) {
        this.logger.debug(`Client connected: ${client.id}`);

        if (!this.worker) {
            this.worker = await mediasoup.createWorker({
                rtcMinPort: 40000,
                rtcMaxPort: 49999,
                logLevel: "debug",
                logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
            });
        }
    }

    @SubscribeMessage("join:conference")
    async handleJoinConference(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room || !this.worker) return;

        // Store client-room c
        this.clientRooms.set(client.id, room);

        let router = this.routers.get(room)?.router;
        if (!router) {
            router = await this.worker.createRouter({
                mediaCodecs: [
                    // Audio codec - Opus (universally supported)
                    {
                        kind: "audio",
                        mimeType: "audio/opus",
                        clockRate: 48000,
                        channels: 2,
                        preferredPayloadType: 111,
                    },
                    // Video codecs - VP8 first (most compatible), then H264, then VP9
                    {
                        kind: "video",
                        mimeType: "video/VP8",
                        clockRate: 90000,
                        preferredPayloadType: 96,
                        rtcpFeedback: [
                            { type: "nack" },
                            { type: "nack", parameter: "pli" },
                            { type: "ccm", parameter: "fir" },
                            { type: "goog-remb" },
                        ],
                    },
                    // H.264 for Safari compatibility
                    {
                        kind: "video",
                        mimeType: "video/H264",
                        clockRate: 90000,
                        preferredPayloadType: 125,
                        parameters: {
                            "packetization-mode": 1,
                            "profile-level-id": "42e01f",
                        },
                        rtcpFeedback: [
                            { type: "nack" },
                            { type: "nack", parameter: "pli" },
                            { type: "ccm", parameter: "fir" },
                            { type: "goog-remb" },
                        ],
                    },
                    // VP9 for modern browsers (optional)
                    {
                        kind: "video",
                        mimeType: "video/VP9",
                        clockRate: 90000,
                        preferredPayloadType: 98,
                        rtcpFeedback: [
                            { type: "nack" },
                            { type: "nack", parameter: "pli" },
                            { type: "ccm", parameter: "fir" },
                            { type: "goog-remb" },
                        ],
                    },
                ],
            });

            this.routers.set(room, { router, transports: new Map() });
        }

        const transport = await router.createWebRtcTransport({
            listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });

        transport.on("dtlsstatechange", (dtlsState) => {
            if (dtlsState === "closed") {
                transport.close();
            }
        });

        transport.on("@close", () => {
            this.logger.debug("Transport closed");
        });

        // Store transport with client info
        transport.appData = { clientId: client.id, room };
        this.routers.get(room)?.transports.set(transport.id, transport);

        // Send existing producers to new client
        const existingProducers: { producerId: string; clientId: unknown; kind: mediasoup.types.MediaKind }[] = [];
        for (const [producerId, producer] of this.producers.entries()) {
            if (producer.appData?.room === room && producer.appData?.clientId !== client.id) {
                existingProducers.push({
                    producerId,
                    clientId: producer.appData.clientId,
                    kind: producer.kind,
                });
            }
        }

        // Emit existing producers to the new client
        if (existingProducers.length > 0) {
            client.emit("existing:producers", existingProducers);
        }

        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters,
            routerRtpCapabilities: router.rtpCapabilities,
        };
    }

    @SubscribeMessage("connect:transport")
    async handleConnectTransport(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, dtlsParameters }: ConnectTransportPayload,
    ) {
        if (!room || !transportId || !dtlsParameters) return;

        const routerData = this.routers.get(room);
        if (!routerData) return;

        const transport = routerData.transports.get(transportId);
        if (!transport) return;

        await transport.connect({ dtlsParameters });
    }

    @SubscribeMessage("produce")
    async handleProduce(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, kind, rtpParameters, appData }: ProducePayload,
    ) {
        if (!room || !transportId || !kind || !rtpParameters) return;

        const router = this.routers.get(room);
        if (!router) return;

        const transport = router.transports.get(transportId);
        if (!transport) return;

        const producer = await transport.produce({
            kind,
            rtpParameters,
            appData: { ...appData, clientId: client.id, room },
        });

        // Store producer
        this.producers.set(producer.id, producer);

        // Notify other clients in the room
        client.to(room).emit("new:producer", {
            producerId: producer.id,
            clientId: client.id,
            kind: producer.kind,
        });

        return { producerId: producer.id };
    }

    // NEW: Create receive transport
    @SubscribeMessage("create:receive:transport")
    async handleCreateReceiveTransport(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room || !this.worker) return;

        const routerData = this.routers.get(room);
        if (!routerData) return;

        const transport = await routerData.router.createWebRtcTransport({
            listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });

        transport.on("dtlsstatechange", (dtlsState) => {
            if (dtlsState === "closed") {
                transport.close();
            }
        });

        transport.appData = { clientId: client.id, room, type: "receive" };
        routerData.transports.set(transport.id, transport);

        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        };
    }

    // NEW: Handle consume request
    @SubscribeMessage("consume")
    async handleConsume(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, producerId, rtpCapabilities }: ConsumePayload,
    ) {
        if (!room || !transportId || !producerId || !rtpCapabilities) return;

        const routerData = this.routers.get(room);
        if (!routerData) return;

        const transport = routerData.transports.get(transportId);
        const producer = this.producers.get(producerId);

        if (!transport || !producer) return;

        // Check if client can consume this producer
        if (!routerData.router.canConsume({ producerId, rtpCapabilities })) {
            return { error: "Cannot consume this producer" };
        }

        const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: true, // Start paused
        });

        consumer.appData = { clientId: client.id, room };
        this.consumers.set(consumer.id, consumer);

        return {
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            producerPaused: consumer.producerPaused,
        };
    }

    // NEW: Resume consumer
    @SubscribeMessage("resume:consumer")
    async handleResumeConsumer(@ConnectedSocket() client: Socket, @MessageBody() { consumerId }: ResumeConsumerPayload) {
        const consumer = this.consumers.get(consumerId);
        if (consumer && consumer.appData?.clientId === client.id) {
            await consumer.resume();
            return { success: true };
        }
        return { error: "Consumer not found" };
    }

    // Update disconnect handler
    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);

        const room = this.clientRooms.get(client.id);
        if (!room) return;

        // Close and remove all transports for this client
        const routerData = this.routers.get(room);
        if (routerData) {
            for (const [transportId, transport] of routerData.transports.entries()) {
                if (transport.appData?.clientId === client.id) {
                    transport.close();
                    routerData.transports.delete(transportId);
                }
            }
        }

        // Close and remove all producers for this client
        const producersToClose: string[] = [];
        for (const [producerId, producer] of this.producers.entries()) {
            if (producer.appData?.clientId === client.id) {
                producersToClose.push(producerId);
                producer.close();
            }
        }

        // Notify other clients about closed producers
        producersToClose.forEach((producerId) => {
            client.to(room).emit("producer:closed", { producerId });
            this.producers.delete(producerId);
        });

        // Close and remove all consumers for this client
        for (const [consumerId, consumer] of this.consumers.entries()) {
            if (consumer.appData?.clientId === client.id) {
                consumer.close();
                this.consumers.delete(consumerId);
            }
        }

        this.clientRooms.delete(client.id);
    }
}
