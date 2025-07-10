/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Room } from "../../classes/room";

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private rooms: Map<string, Room> = new Map();

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        const socketRooms = Array.from(client.rooms).filter((r) => r !== client.id);

        socketRooms.forEach((room) => {
            const currRoom = this.rooms.get(room);

            if (currRoom) {
                currRoom.removeUser(client.id);
                const restUsers = currRoom.getUsers();

                if (restUsers.length === 0) {
                    this.rooms.delete(room);
                } else {
                    this.server.in(room).emit("room:users", { users: restUsers });
                }
            }
        });
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, name } = data;

        if (room) {
            await client.join(room);
            if (!this.rooms.has(room)) this.rooms.set(room, new Room());

            const currRoom = this.rooms.get(room);
            const userData = currRoom?.addUser(client.id, name);

            this.server.in(room).emit("room:users", {
                users: currRoom?.getUsers(),
                to: userData?.id,
            });
        }
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room } = data;

        if (room) {
            await client.leave(room);
            const currRoom = this.rooms.get(room);

            if (currRoom) {
                currRoom.removeUser(client.id);
                const restUsers = currRoom.getUsers();

                if (restUsers.length === 0) {
                    this.rooms.delete(room);
                } else {
                    this.server.in(room).emit("room:users", { users: restUsers });
                }
            }
        }
    }

    @SubscribeMessage("update:name")
    handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, name } = data;

        if (room) {
            const currRoom = this.rooms.get(room);

            if (currRoom) {
                currRoom.updateName(client.id, name);
                client.to(room).emit("update:name", { id: client.id, name });
            }
        }
    }
}
