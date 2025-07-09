import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(80, { namespace: "/user" })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log("UserGateway connected", typeof client);
    }

    handleDisconnect() {
        console.log("YjsGateway disconnected");
    }
}
