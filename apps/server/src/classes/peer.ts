import mediasoup from "mediasoup";

interface PeerState {
    id: string;
    name: string;
    transports: Map<string, mediasoup.types.WebRtcTransport>;
    consumers: Map<string, mediasoup.types.Consumer>;
    producers: Map<string, mediasoup.types.Producer>;
}

export class Peer implements PeerState {
    id: string;
    name: string;
    transports: Map<string, mediasoup.types.WebRtcTransport>;
    consumers: Map<string, mediasoup.types.Consumer>;
    producers: Map<string, mediasoup.types.Producer>;

    constructor(socketId: string, name: string) {
        this.id = socketId;
        this.name = name;
        this.transports = new Map();
        this.consumers = new Map();
        this.producers = new Map();
    }

    addTransport(transport: mediasoup.types.WebRtcTransport) {
        this.transports.set(transport.id, transport);
    }

    async connectTransport(transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
        if (!this.transports.has(transportId)) return;

        await this.transports.get(transportId).connect({
            dtlsParameters: dtlsParameters,
        });
    }

    async createProducer(producerTransportId: string, rtpParameters: mediasoup.types.RtpParameters, kind: mediasoup.types.MediaKind) {
        // TODO handle null errors
        let producer = await this.transports.get(producerTransportId).produce({
            kind,
            rtpParameters,
        });

        this.producers.set(producer.id, producer);

        producer.on(
            "transportclose",
            function () {
                console.log("Producer transport close", { name: `${this.name}`, consumerId: `${producer.id}` });
                producer.close();
                this.producers.delete(producer.id);
            }.bind(this)
        );

        return producer;
    }

    async createConsumer(consumerTransportId: string, producerId: string, rtpCapabilities: mediasoup.types.RtpCapabilities) {
        let consumerTransport = this.transports.get(consumerTransportId);

        let consumer: mediasoup.types.Consumer = null;
        try {
            consumer = await consumerTransport.consume({ producerId, rtpCapabilities, paused: false });
        } catch (error) {
            console.error("Consume failed", error);
            return;
        }

        if (consumer.type === "simulcast") {
            await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
        }

        this.consumers.set(consumer.id, consumer);

        consumer.on(
            "transportclose",
            function () {
                console.log("Consumer transport close", { name: `${this.name}`, consumerId: `${consumer.id}` });
                this.consumers.delete(consumer.id);
            }.bind(this)
        );

        return {
            consumer,
            params: {
                producerId,
                id: consumer.id,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                type: consumer.type,
                producerPaused: consumer.producerPaused,
            },
        };
    }

    closeProducer(producerId: string) {
        try {
            this.producers.get(producerId).close();
        } catch (e) {
            console.warn(e);
        }

        this.producers.delete(producerId);
    }

    getProducer(producerId: string) {
        return this.producers.get(producerId);
    }

    close() {
        this.transports.forEach((transport) => transport.close());
    }

    removeConsumer(consumerId: string) {
        this.consumers.delete(consumerId);
    }
}
