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
    clients: Map<string, ClientInfo>;
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

type ClientInfo = {
    transports: Set<string>;
    producers: Set<string>;
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
        routerInfo.webRtcServer.close();
        routerInfo.router.close();
        this.routers.delete(room);

        this.logger.debug(`Cleaned up router for room: ${room}`);
    }

    async createRouter(client: Socket, room: string) {
        if (!this.worker) return { success: false, message: "Worker not initialized" };

        try {
            const routerInfo = this.routers.get(room);
            const clientInfo: ClientInfo = {
                transports: new Set(),
                producers: new Set(),
            };

            if (!routerInfo) {
                const router = await this.worker.createRouter({
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
                            ip: "0.0.0.0",
                            portRange: { min: 40000, max: 40100 },
                            announcedAddress: this.configService.get("serverIp")!,
                        },
                        {
                            protocol: "tcp",
                            ip: "0.0.0.0",
                            portRange: { min: 40000, max: 40100 },
                            announcedAddress: this.configService.get("serverIp")!,
                        },
                    ],
                });

                this.routers.set(room, {
                    router,
                    webRtcServer,
                    transports: new Map(),
                    producers: new Map(),
                    consumers: new Map(),
                    clients: new Map([[client.id, clientInfo]]),
                });

                this.logger.debug(`Created new router for room: ${room}`);

                return {
                    success: true,
                    message: "Router created successfully",
                    data: {
                        rtpCapabilities: router.rtpCapabilities,
                    },
                };
            } else {
                routerInfo.clients.set(client.id, clientInfo);

                return {
                    success: true,
                    message: "Router created successfully",
                    data: {
                        rtpCapabilities: routerInfo.router.rtpCapabilities,
                    },
                };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to create router" };
        }
    }

    async createSendTransport(client: Socket, room: string) {
        const routerInfo = this.routers.get(room);
        if (!routerInfo) return { success: false, message: "Router not found" };

        const clientInfo = routerInfo.clients.get(client.id);
        if (!clientInfo) return { success: false, message: "Client not found" };

        try {
            const transport: Transport = await routerInfo.router.createWebRtcTransport({
                webRtcServer: routerInfo.webRtcServer,
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
            routerInfo.transports.set(transport.id, {
                transport,
                type: "send",
                connected: false,
            });
            clientInfo.transports.add(transport.id);

            // Send existing producers to the new client
            const producers: { id: string; kind: mediasoup.types.MediaKind }[] = [];
            routerInfo.producers.forEach(({ producer, kind }, id) => {
                if (producer.appData.clientId !== client.id) {
                    producers.push({ id, kind });
                }
            });

            console.log(`${client.id} | SEND | ${transport.id}`);
            return {
                success: true,
                message: "Transport created successfully",
                data: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                    sctpParameters: transport.sctpParameters,
                    producers,
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
            routerData.transports.get(transportId)!.connected = true;

            return { success: true, message: "Transport connected successfully" };
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
        const clientInfo = routerData.clients.get(client.id);
        if (!clientInfo) return { success: false, message: "Client not found" };

        const transport = routerData.transports.get(transportId)?.transport;
        if (!transport) return { success: false, message: "Transport not found" };

        try {
            const producer: Producer = await transport.produce({
                kind,
                rtpParameters,
                appData: { clientId: client.id, room },
            });
            routerData.producers.set(producer.id, { producer, kind });
            clientInfo.producers.add(producer.id);

            // Notify existing clients about the new producer
            client.to(room).emit("create:producer", { id: producer.id, kind });

            return { success: true, message: "Producer created successfully", data: { id: producer.id } };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create producer" };
        }
    }

    async createReceiveTransport(client: Socket, room: string) {
        const routerData = this.routers.get(room);
        if (!routerData) return { success: false, message: "Router not found" };
        const clientInfo = routerData.clients.get(client.id);
        if (!clientInfo) return { success: false, message: "Client not found" };

        try {
            const transport: Transport = await routerData.router.createWebRtcTransport({
                webRtcServer: routerData.webRtcServer,
                enableUdp: true,
                enableTcp: false,
            });

            transport.on("dtlsstatechange", (dtlsState) => {
                if (dtlsState === "closed") {
                    transport.close();
                }
            });

            transport.appData = { clientId: client.id, room };
            routerData.transports.set(transport.id, {
                transport,
                type: "receive",
                connected: false,
            });
            clientInfo.transports.add(transport.id);

            console.log(`${client.id} | RECEIVE | ${transport.id}`);
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
            routerData.transports.get(transportId)!.connected = true;

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
        const clientInfo = routerData.clients.get(client.id);
        if (!clientInfo) return { success: false, message: "Client not found" };

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
            routerData.consumers.set(consumer.id, {
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

    deleteProducer(client: Socket, room: string, producers: string[]) {
        const routerInfo = this.routers.get(room);
        if (!routerInfo) return;
        const clientInfo = routerInfo.clients.get(client.id);
        if (!clientInfo) return;

        for (const producerId of producers) {
            const producerInfo = routerInfo.producers.get(producerId);
            if (producerInfo) {
                producerInfo.producer.close();
                routerInfo.producers.delete(producerId);
                clientInfo.producers.delete(producerId);
            }
        }

        for (const [consumerId, consumer] of routerInfo.consumers) {
            if (producers.includes(consumer.producerId)) {
                consumer.consumer.close();
                routerInfo.consumers.delete(consumerId);
            }
        }

        if (producers.length > 0) {
            client.to(room).emit("delete:producer", { producers });
        }
    }

    removeClient(room: string, client: Socket) {
        const routerInfo = this.routers.get(room);
        if (!routerInfo) return;
        const clientInfo = routerInfo.clients.get(client.id);
        if (!clientInfo) return;

        const { transports, producers } = clientInfo;

        const removedProducers: string[] = [];

        for (const transportId of transports) {
            const transportInfo = routerInfo.transports.get(transportId);
            if (transportInfo) {
                transportInfo.transport.close();
                routerInfo.transports.delete(transportId);
                clientInfo.transports.delete(transportId);
            }
        }

        for (const producerId of producers) {
            const producerInfo = routerInfo.producers.get(producerId);
            if (producerInfo) {
                producerInfo.producer.close();
                routerInfo.producers.delete(producerId);
                clientInfo.producers.delete(producerId);
                removedProducers.push(producerId);
            }
        }

        for (const [consumerId, { consumer, producerId }] of routerInfo.consumers) {
            if (consumer.appData.clientId === client.id || removedProducers.includes(producerId)) {
                consumer.close();
                routerInfo.consumers.delete(consumerId);
            }
        }

        if (removedProducers.length > 0) {
            client.to(room).emit("delete:producer", { producers: removedProducers });
        }

        routerInfo.clients.delete(client.id);
        if (routerInfo.clients.size === 0) {
            routerInfo.router.close();
            routerInfo.webRtcServer.close();
            this.routers.delete(room);
        }
    }
}
