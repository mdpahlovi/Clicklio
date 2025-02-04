import mediasoup, { types } from "mediasoup";
import { Socket } from "socket.io";

type Peer = {
    socket: Socket;
    roomId: string;
    transports: string[];
    producers: string[];
    consumers: string[];
    peerDetails: { name: string; isAdmin: boolean };
};

type Room = {
    router: types.Router;
    peers: Peer[];
};

let rooms: { [key: string]: Room } = {};
let peers: { [key: string]: Peer } = {};
let transports: { roomId: string; socketId: string; transport: types.WebRtcTransport; consumer: types.Consumer }[] = [];
let producers: { roomId: string; socketId: string; producer: types.Producer }[] = [];
let consumers: { roomId: string; socketId: string; consumer: types.Consumer }[] = [];

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

export const createRoom = async (worker: types.Worker, socket: Socket, roomId: string) => {
    let router: types.Router;
    let peers: Peer[] = [];

    if (rooms[roomId]) {
        router = rooms[roomId].router;
        peers = rooms[roomId].peers || [];
    } else {
        router = await worker.createRouter({ mediaCodecs });
    }

    const newPeer: Peer = (peers[socket.id] = {
        socket,
        roomId,
        transports: [],
        producers: [],
        consumers: [],
        peerDetails: {
            name: "",
            isAdmin: false,
        },
    });

    rooms[roomId] = { router, peers: [...peers, newPeer] };

    return router;
};

export const addTransport = (transport: types.WebRtcTransport, socketId: string, roomId: string, consumer: types.Consumer) => {
    transports = [...transports, { socketId, transport, roomId, consumer }];

    peers[socketId] = {
        ...peers[socketId],
        transports: [...peers[socketId].transports, transport.id],
    };
};

export const addProducer = (producer: types.Producer, socketId: string, roomId: string) => {
    producers = [...producers, { socketId, producer, roomId }];

    peers[socketId] = {
        ...peers[socketId],
        producers: [...peers[socketId].producers, producer.id],
    };
};

export const addConsumer = (consumer: types.Consumer, socketId: string, roomId: string) => {
    consumers = [...consumers, { socketId, consumer, roomId }];

    peers[socketId] = {
        ...peers[socketId],
        consumers: [...peers[socketId].consumers, consumer.id],
    };
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
