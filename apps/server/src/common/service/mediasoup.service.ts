import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mediasoup from "mediasoup";
import { Socket } from "socket.io";

type AppData = { clientId: string; room: string };
type Transport = mediasoup.types.WebRtcTransport<AppData>;
type Producer = mediasoup.types.Producer<AppData>;
type Consumer = mediasoup.types.Consumer<AppData>;

type RouterInfo = {
    router: mediasoup.types.Router;
    webRtcServer: mediasoup.types.WebRtcServer;
    transports: Map<string, TransportInfo>;
    producers: Map<string, ProducerInfo>;
    consumers: Map<string, ConsumerInfo>;
    participantCount: number;
};

type TransportInfo = {
    transport: Transport;
    type: "send" | "receive";
    connected: boolean;
};

type ProducerInfo = {
    producer: Producer;
    kind: mediasoup.types.MediaKind;
};

type ConsumerInfo = {
    consumer: Consumer;
    producerId: string;
    kind: mediasoup.types.MediaKind;
};

@Injectable()
export class MediasoupService implements OnModuleInit, OnApplicationShutdown {
    private readonly logger = new Logger(MediasoupService.name);

    constructor(private configService: ConfigService) {}

    private worker?: mediasoup.types.Worker;
    private routers: Map<string, RouterInfo> = new Map();

    private restartAttempts = 0;

    async onModuleInit() {
        await this.initialize();
    }

    onApplicationShutdown() {
        this.logger.debug("Shutting down mediasoup worker...");
        this.worker?.close();
    }

    async initialize(): Promise<void> {
        try {
            this.worker = await mediasoup.createWorker({
                logLevel: "warn",
                logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp", "rtx", "bwe", "score", "simulcast", "svc", "sctp"],
                disableLiburing: false,
            });

            this.worker.on("died", () => {
                this.logger.debug("Worker died! Restarting...");

                this.routers.forEach((_, room) => this.cleanupRouter(room));
                this.routers.clear();

                this.restartAttempts++;
                if (this.restartAttempts > 5) {
                    this.logger.error("Failed to restart worker after 5 attempts");
                    return;
                }

                setTimeout(() => {
                    this.initialize()
                        .then(() => {
                            this.restartAttempts = 0;
                            this.logger.debug("Worker restarted successfully");
                        })
                        .catch((error) => {
                            this.logger.error("Failed to restart worker:", error);
                        });
                }, 1000);
            });

            this.logger.debug(`Worker initialized successfully with PID: ${this.worker.pid}`);
        } catch (error) {
            this.logger.error("Failed to create worker:", error);
        }
    }

    private cleanupRouter(room: string) {
        const routerInfo = this.routers.get(room);
        if (!routerInfo) return;

        routerInfo.transports.forEach((transportInfo) => {
            transportInfo.transport.close();
        });
        routerInfo.producers.forEach((producerInfo) => {
            producerInfo.producer.close();
        });
        routerInfo.consumers.forEach((consumerInfo) => {
            consumerInfo.consumer.close();
        });
        routerInfo.router.close();
        this.routers.delete(room);

        this.logger.debug(`Cleaned up router for room: ${room}`);
    }

    async createRouter(room: string) {
        if (!this.worker) return { success: false, message: "Worker not initialized" };

        try {
            let router = this.routers.get(room)?.router;
            if (!router) {
                router = await this.worker.createRouter({
                    mediaCodecs: [
                        {
                            kind: "audio",
                            mimeType: "audio/opus",
                            clockRate: 48000,
                            channels: 2,
                        },
                        {
                            kind: "video",
                            mimeType: "video/VP8",
                            clockRate: 90000,
                            parameters: {
                                "x-google-start-bitrate": 1000,
                            },
                        },
                        {
                            kind: "video",
                            mimeType: "video/VP9",
                            clockRate: 90000,
                            parameters: {
                                "profile-id": 2,
                                "x-google-start-bitrate": 1000,
                            },
                        },
                        {
                            kind: "video",
                            mimeType: "video/h264",
                            clockRate: 90000,
                            parameters: {
                                "packetization-mode": 1,
                                "profile-level-id": "4d0032",
                                "level-asymmetry-allowed": 1,
                                "x-google-start-bitrate": 1000,
                            },
                        },
                        {
                            kind: "video",
                            mimeType: "video/h264",
                            clockRate: 90000,
                            parameters: {
                                "packetization-mode": 1,
                                "profile-level-id": "42e01f",
                                "level-asymmetry-allowed": 1,
                                "x-google-start-bitrate": 1000,
                            },
                        },
                    ],
                });

                const webRtcServer = await this.worker.createWebRtcServer({
                    listenInfos: [
                        {
                            protocol: "udp",
                            ip: this.configService.get("serverIp")!,
                            port: 44444,
                        },
                        {
                            protocol: "tcp",
                            ip: this.configService.get("serverIp")!,
                            port: 44444,
                        },
                    ],
                });

                this.routers.set(room, {
                    router,
                    webRtcServer,
                    transports: new Map(),
                    producers: new Map(),
                    consumers: new Map(),
                    participantCount: 0,
                });

                this.logger.debug(`Created new router for room: ${room}`);
            }

            return {
                success: true,
                message: "Router created successfully",
                data: {
                    rtpCapabilities: router.rtpCapabilities,
                },
            };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to create router" };
        }
    }

    async createSendTransport(client: Socket, room: string) {
        const router = this.routers.get(room)?.router;
        if (!router) return { success: false, message: "Router not found" };

        try {
            const transport: Transport = await router.createWebRtcTransport({
                webRtcServer: this.routers.get(room)!.webRtcServer,
                enableUdp: true,
                enableTcp: false,
            });

            transport.on("dtlsstatechange", (dtlsState) => {
                if (dtlsState === "closed") {
                    transport.close();
                }
            });

            transport.on("@close", () => {
                this.logger.debug("Transport closed");
            });

            transport.appData = { clientId: client.id, room };
            this.routers.get(room)?.transports.set(transport.id, {
                transport,
                type: "send",
                connected: false,
            });

            return {
                success: true,
                message: "Transport created successfully",
                data: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                    sctpParameters: transport.sctpParameters,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create transport" };
        }
    }

    async connectSendTransport(room: string, transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
        const routerData = this.routers.get(room);
        if (!routerData) return { success: false, message: "Router not found" };

        const transport = routerData.transports.get(transportId)?.transport;
        if (!transport) return { success: false, message: "Transport not found" };

        try {
            await transport.connect({ dtlsParameters });
            this.routers.get(room)!.transports.get(transportId)!.connected = true;

            // Send existing producers to the new client
            const producers: { id: string; kind: mediasoup.types.MediaKind }[] = [];
            this.routers.get(room)!.producers.forEach(({ kind }, id) => {
                producers.push({ id, kind });
            });

            return { success: true, message: "Transport connected successfully", data: { producers } };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to connect transport" };
        }
    }

    async createProducer(
        client: Socket,
        room: string,
        transportId: string,
        kind: mediasoup.types.MediaKind,
        rtpParameters: mediasoup.types.RtpParameters,
    ) {
        const routerData = this.routers.get(room);
        if (!routerData) return { success: false, message: "Router not found" };

        const transport = routerData.transports.get(transportId)?.transport;
        if (!transport) return { success: false, message: "Transport not found" };

        try {
            const producer: Producer = await transport.produce({
                kind,
                rtpParameters,
                appData: { clientId: client.id, room },
            });
            this.routers.get(room)!.participantCount++;
            this.routers.get(room)!.producers.set(producer.id, { producer, kind });

            // Notify existing clients about the new producer
            client.to(room).emit("create:producer", { id: producer.id, kind });

            return { success: true, message: "Producer created successfully", data: { id: producer.id } };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create producer" };
        }
    }

    async createReceiveTransport(client: Socket, room: string) {
        const router = this.routers.get(room)?.router;
        if (!router) return { success: false, message: "Router not found" };

        try {
            const transport: Transport = await router.createWebRtcTransport({
                webRtcServer: this.routers.get(room)!.webRtcServer,
                enableUdp: true,
                enableTcp: false,
            });

            transport.on("dtlsstatechange", (dtlsState) => {
                if (dtlsState === "closed") {
                    transport.close();
                }
            });

            transport.appData = { clientId: client.id, room };
            this.routers.get(room)?.transports.set(transport.id, {
                transport,
                type: "receive",
                connected: false,
            });

            return {
                success: true,
                message: "Transport created successfully",
                data: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                    sctpParameters: transport.sctpParameters,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create transport" };
        }
    }

    async connectReceiveTransport(room: string, transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
        const routerData = this.routers.get(room);
        if (!routerData) return { success: false, message: "Router not found" };

        const transport = routerData.transports.get(transportId)?.transport;
        if (!transport) return { success: false, message: "Transport not found" };

        try {
            await transport.connect({ dtlsParameters });
            this.routers.get(room)!.transports.get(transportId)!.connected = true;

            return { success: true, message: "Transport connected successfully" };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to connect transport" };
        }
    }

    async createConsumer(
        client: Socket,
        room: string,
        transportId: string,
        producerId: string,
        rtpCapabilities: mediasoup.types.RtpCapabilities,
    ) {
        const routerData = this.routers.get(room);
        if (!routerData) return { success: false, message: "Router not found" };

        const transport = routerData.transports.get(transportId)?.transport;
        if (!transport) return { success: false, message: "Transport not found" };

        if (!routerData.router.canConsume({ producerId, rtpCapabilities })) {
            return { success: false, message: "Cannot consume this producer" };
        }

        try {
            const consumer: Consumer = await transport.consume({
                producerId,
                rtpCapabilities,
                appData: { clientId: client.id, room },
            });
            this.routers.get(room)!.consumers.set(consumer.id, {
                consumer,
                producerId,
                kind: consumer.kind,
            });

            return {
                success: true,
                message: "Consumer created successfully",
                data: {
                    id: consumer.id,
                    producerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create consumer" };
        }
    }

    removeClient(room: string, client: Socket) {
        const routerInfo = this.routers.get(room);
        if (!routerInfo) return;

        const { transports, producers, consumers } = routerInfo;

        const removedTransports: string[] = [];
        const removedProducers: string[] = [];
        const removedConsumers: string[] = [];

        for (const [transportId, transportInfo] of transports) {
            if (transportInfo.transport.appData.clientId === client.id) {
                transportInfo.transport.close();
                transports.delete(transportId);
                removedTransports.push(transportId);
            }
        }

        for (const [producerId, producerInfo] of producers) {
            if (producerInfo.producer.appData.clientId === client.id) {
                producerInfo.producer.close();
                producers.delete(producerId);
                removedProducers.push(producerId);
            }
        }

        for (const [consumerId, consumerInfo] of consumers) {
            if (consumerInfo.consumer.appData.clientId === client.id) {
                consumerInfo.consumer.close();
                consumers.delete(consumerId);
                removedConsumers.push(consumerId);
            }
        }

        if (removedTransports.length > 0 || removedProducers.length > 0 || removedConsumers.length > 0) {
            client.to(room).emit("delete:producer", {
                transports: removedTransports,
                producers: removedProducers,
                consumers: removedConsumers,
            });
        }

        routerInfo.participantCount = Math.max(0, routerInfo.participantCount - 1);

        if (routerInfo.participantCount === 0) this.cleanupRouter(room);
    }
}
