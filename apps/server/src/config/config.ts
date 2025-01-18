import os from "os";
import mediasoup from "mediasoup";

interface MediasoupConfig {
    numWorkers: number;
    worker: mediasoup.types.WorkerSettings<mediasoup.types.AppData>;
    router: mediasoup.types.RouterOptions<mediasoup.types.AppData>;
    webRtcTransport: mediasoup.types.WebRtcTransportOptions<mediasoup.types.AppData>;
}

interface Config {
    sslCrt: string;
    sslKey: string;
    mediasoup: MediasoupConfig;
}

const config: Config = {
    sslCrt: "../ssl/cert.pem",
    sslKey: "../ssl/key.pem",

    mediasoup: {
        numWorkers: Object.keys(os.cpus()).length,
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: "warn",
            logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp", "rtx", "bwe", "score", "simulcast", "svc"],
        },
        // Router settings
        router: {
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
            ],
        },
        // WebRtcTransport settings
        webRtcTransport: {
            listenInfos: [
                {
                    protocol: "udp",
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.0.102", // replace by public IP address
                },
            ],
            initialAvailableOutgoingBitrate: 1000000,
        },
    },
};

export { config };
