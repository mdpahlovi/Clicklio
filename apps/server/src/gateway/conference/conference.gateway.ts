import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class ConferenceGateway {
    @WebSocketServer() server: Server;

    @SubscribeMessage("join:conference")
    handleJoinConference(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log({ client, data });
    }
}
