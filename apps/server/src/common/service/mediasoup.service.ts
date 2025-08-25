import { BadRequestException, Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import * as mediasoup from "mediasoup";

type AppData = { clientId: string; room: string };

type RouterInfo = {
    router: mediasoup.types.Router;
    transports: Map<string, TransportInfo>;
    producers: Map<string, ProducerInfo>;
    consumers: Map<string, ConsumerInfo>;
    participantCount: number;
};

type TransportInfo = {
    transport: mediasoup.types.WebRtcTransport<AppData>;
    type: "send" | "receive";
    connected: boolean;
};

type ProducerInfo = {
    producer: mediasoup.types.Producer<AppData>;
    kind: mediasoup.types.MediaKind;
};

type ConsumerInfo = {
    consumer: mediasoup.types.Consumer<AppData>;
    producerId: string;
    kind: mediasoup.types.MediaKind;
};

@Injectable()
export class MediasoupService implements OnModuleInit, OnApplicationShutdown {
    private readonly logger = new Logger(MediasoupService.name);

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
                rtcMinPort: 40000,
                rtcMaxPort: 49999,
                logLevel: "warn",
                logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
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

    async createRouter(room: string): Promise<mediasoup.types.Router> {
        if (!this.worker) throw new BadRequestException("Worker not initialized");

        let router = this.routers.get(room)?.router;
        if (!router) {
            router = await this.worker.createRouter({
                mediaCodecs: [
                    // Audio - Opus
                    {
                        kind: "audio",
                        mimeType: "audio/opus",
                        clockRate: 48000,
                        channels: 2,
                        preferredPayloadType: 111,
                    },
                    // Video - VP8 (best compatibility)
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
                    // Video - H.264 (Safari compatibility)
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
                ],
            });

            this.routers.set(room, {
                router,
                transports: new Map(),
                producers: new Map(),
                consumers: new Map(),
                participantCount: 0,
            });

            this.logger.debug(`Created new router for room: ${room}`);
        }

        return router;
    }
}
