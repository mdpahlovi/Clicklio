import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client) {
        console.log("YjsGateway connected", typeof client);
    }

    handleDisconnect() {
        console.log("YjsGateway disconnected");
    }
}
