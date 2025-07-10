import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({ namespace: "canvas" })
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client) {
        console.log("CanvasGateway connected", typeof client);
    }

    handleDisconnect() {
        console.log("CanvasGateway disconnected");
    }
}
