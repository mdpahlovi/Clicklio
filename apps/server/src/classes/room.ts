import mediasoup from "mediasoup";
import { Server } from "socket.io";
import { config } from "../config/config.js";
import { Peer } from "./peer.js";

interface RoomState {
    room: string;
    router: mediasoup.types.Router;
    peers: Map<string, Peer>;
    io: Server;
}

export class Room implements RoomState {
    room: string;
    router: mediasoup.types.Router;
    peers: Map<string, Peer>;
    io: Server;

    constructor(room: string, worker: mediasoup.types.Worker, io) {
        this.room = room;
        this.io = io;

        const mediaCodecs = config.mediasoup.router.mediaCodecs;
        worker.createRouter({ mediaCodecs }).then(
            function (router) {
                this.router = router;
            }.bind(this)
        );
    }

    // Rest of the methods remain the same
    addPeer(peer: Peer) {
        this.peers.set(peer.id, peer);
    }

    getProducerListForPeer() {
        let producerList = [];
        this.peers.forEach((peer) => {
            peer.producers.forEach((producer) => {
                producerList.push({
                    producerId: producer.id,
                });
            });
        });
        return producerList;
    }

    getRtpCapabilities() {
        return this.router.rtpCapabilities;
    }

    async createWebRtcTransport(socketId: string) {
        const { initialAvailableOutgoingBitrate } = config.mediasoup.webRtcTransport;

        const transport = await this.router.createWebRtcTransport({
            listenInfos: config.mediasoup.webRtcTransport.listenInfos,
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            initialAvailableOutgoingBitrate,
        });

        transport.on(
            "dtlsstatechange",
            function (dtlsState: mediasoup.types.DtlsState) {
                if (dtlsState === "closed") {
                    console.log("Transport close", { name: this.peers.get(socketId).name });
                    transport.close();
                }
            }.bind(this)
        );

        transport.on("@close", () => {
            console.log("Transport close", { name: this.peers.get(socketId).name });
        });

        console.log("Adding transport", { transportId: transport.id });
        this.peers.get(socketId).addTransport(transport);
        return {
            params: {
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
            },
        };
    }

    async connectPeerTransport(socketId: string, transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
        if (!this.peers.has(socketId)) return;

        await this.peers.get(socketId).connectTransport(transportId, dtlsParameters);
    }

    async produce(
        socketId: string,
        producerTransportId: string,
        rtpParameters: mediasoup.types.RtpParameters,
        kind: mediasoup.types.MediaKind
    ) {
        return new Promise(
            async function (resolve, reject) {
                let producer = await this.peers.get(socketId).createProducer(producerTransportId, rtpParameters, kind);
                resolve(producer.id);

                for (let otherSocketId of Array.from(this.peers.keys()).filter((id) => id !== socketId)) {
                    this.io.to(otherSocketId).emit("newProducers", { producerId: producer.id, producerSocketId: socketId });
                }
            }.bind(this)
        );
    }

    async consume(socketId: string, consumerTransportId: string, producerId: string, rtpCapabilities: mediasoup.types.RtpCapabilities) {
        if (!this.router.canConsume({ producerId, rtpCapabilities })) {
            console.error("can not consume");
            return;
        }

        let { consumer, params } = await this.peers.get(socketId).createConsumer(consumerTransportId, producerId, rtpCapabilities);

        consumer.on(
            "producerclose",
            function () {
                console.log("Consumer closed due to producer close event", {
                    name: `${this.peers.get(socketId).name}`,
                    consumerId: `${consumer.id}`,
                });
                this.peers.get(socketId).removeConsumer(consumer.id);
                this.io.to(socketId).emit("consumerClosed", { consumerId: consumer.id });
            }.bind(this)
        );

        return params;
    }

    async removePeer(socketId: string) {
        this.peers.get(socketId).close();
        this.peers.delete(socketId);
    }

    closeProducer(socketId: string, producerId: string) {
        this.peers.get(socketId).closeProducer(producerId);
    }

    getPeers() {
        return this.peers;
    }

    toJson() {
        return { room: this.room, peers: JSON.stringify([...this.peers]) };
    }
}
