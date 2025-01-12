import mediasoup from "mediasoup";

const workerSettings: mediasoup.types.WorkerSettings = {
    logLevel: "warn",
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
};

const routerOptions = {
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
        },
    ],
};

let worker;
let router;

const createWorker = async () => {
    worker = await mediasoup.createWorker(workerSettings);
    worker.on("died", () => {
        console.error("MediaSoup worker has died");
    });

    router = await worker.createRouter({ mediaCodecs: routerOptions });
};

export { createWorker, worker, router };
