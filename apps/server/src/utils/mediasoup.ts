import mediasoup, { types } from "mediasoup";

const mediaCodecs: types.RtpCodecCapability[] = [
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
];

export const createWorker = async () => {
    const worker = await mediasoup.createWorker({
        rtcMinPort: 2000,
        rtcMaxPort: 2020,
    });

    worker.on("died", (error) => {
        console.error("mediasoup worker has died");
        setTimeout(() => process.exit(1), 2000);
    });

    return worker;
};

export const createRoom = async (worker: types.Worker, rooms, roomId: string, socketId: string) => {
    let router: types.Router;
    let peers = [];

    if (rooms[roomId]) {
        router = rooms[roomId].router;
        peers = rooms[roomId].peers || [];
    } else {
        router = await worker.createRouter({ mediaCodecs });
    }

    rooms[roomId] = { router, peers: [...peers, socketId] };

    return router;
};

export const createWebRtcTransport = async (router: types.Router) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transport = await router.createWebRtcTransport({
                listenIps: [
                    {
                        ip: "0.0.0.0",
                        announcedIp: "192.168.214.42",
                    },
                ],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
            });

            transport.on("dtlsstatechange", (dtlsState) => {
                if (dtlsState === "closed") transport.close();
            });

            transport.on("@close", () => {
                console.log("transport closed");
            });

            resolve(transport);
        } catch (error) {
            reject(error);
        }
    });
};
