import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import * as mediasoup from "mediasoup";
import { Socket } from "socket.io";
import { MediasoupService } from "src/common/service/mediasoup.service";

type ConnectTransportPayload = {
    room: string;
    transportId: string;
    dtlsParameters: mediasoup.types.DtlsParameters;
};

type CreateProducerPayload = {
    room: string;
    transportId: string;
    kind: mediasoup.types.MediaKind;
    rtpParameters: mediasoup.types.RtpParameters;
};

type CreateConsumePayload = {
    room: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: mediasoup.types.RtpCapabilities;
};

@WebSocketGateway({ cors: { origin: "*" } })
export class ConferenceGateway {
    private readonly logger = new Logger(ConferenceGateway.name);

    constructor(private readonly mediasoupService: MediasoupService) {}

    @SubscribeMessage("create:router")
    async handleCreateRouter(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.mediasoupService.createRouter(room);
    }

    @SubscribeMessage("create:send:transport")
    async handleCreateSendTransport(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.mediasoupService.createSendTransport(client, room);
    }

    @SubscribeMessage("connect:send:transport")
    async handleConnectSendTransport(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, dtlsParameters }: ConnectTransportPayload,
    ) {
        if (!room || !transportId || !dtlsParameters) return { success: false, message: "Invalid parameters" };

        return await this.mediasoupService.connectSendTransport(room, transportId, dtlsParameters);
    }

    @SubscribeMessage("create:producer")
    async handleCreateProducer(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, kind, rtpParameters }: CreateProducerPayload,
    ) {
        if (!room || !transportId || !kind || !rtpParameters) return { success: false, message: "Invalid parameters" };

        return await this.mediasoupService.createProducer(client, room, transportId, kind, rtpParameters);
    }

    @SubscribeMessage("create:receive:transport")
    async handleCreateReceiveTransport(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.mediasoupService.createReceiveTransport(client, room);
    }

    @SubscribeMessage("connect:receive:transport")
    async handleConnectReceiveTransport(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, dtlsParameters }: ConnectTransportPayload,
    ) {
        if (!room || !transportId || !dtlsParameters) return { success: false, message: "Invalid parameters" };

        return await this.mediasoupService.connectReceiveTransport(room, transportId, dtlsParameters);
    }

    @SubscribeMessage("create:consumer")
    async handleCreateConsumer(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, transportId, producerId, rtpCapabilities }: CreateConsumePayload,
    ) {
        if (!room || !transportId || !producerId || !rtpCapabilities) return { success: false, message: "Invalid parameters" };

        return await this.mediasoupService.createConsumer(client, room, transportId, producerId, rtpCapabilities);
    }

    @SubscribeMessage("delete:producer")
    handleDeleteProducer(@ConnectedSocket() client: Socket, @MessageBody() { room }: { room: string }) {
        if (!room) return { success: false, message: "Room is required" };

        return this.mediasoupService.removeClient(room, client);
    }
}
