import { types } from "mediasoup";
import { Server } from "socket.io";
import { Room } from "../classes/room.js";
import { VideoRoom } from "../classes/video-room.js";

let VideoChatRoomList = new Map<string, VideoRoom>();

export const handleConnection = (io: Server, worker: types.Worker) => {
    const rooms: Map<string, Room> = new Map();

    io.on("connection", (socket) => {
        socket.on("join:room", ({ room, name }) => {
            if (room) {
                socket.join(room);
                if (!rooms.has(room)) rooms.set(room, new Room());

                const currRoom = rooms.get(room);
                const userData = currRoom.addUser(socket.id, name);

                io.in(room).emit("room:users", { users: currRoom.getUsers(), to: userData.id });
            }
        });

        socket.on("leave:room", ({ room }) => {
            if (room) {
                socket.leave(room);
                const currRoom = rooms.get(room);

                if (currRoom) {
                    currRoom.removeUser(socket.id);
                    const restUsers = currRoom.getUsers();

                    if (restUsers.length === 0) {
                        rooms.delete(room);
                    } else {
                        io.in(room).emit("room:users", { users: restUsers });
                    }
                }
            }
        });

        socket.on("update:name", ({ room, name }) => {
            if (room) {
                const currRoom = rooms.get(room);

                if (currRoom) {
                    currRoom.updateName(socket.id, name);
                    socket.to(room).emit("update:name", { id: socket.id, name });
                }
            }
        });

        socket.on("initial:state", ({ to, ...state }) => {
            if (to) io.to(to).emit("initial:state", state);
        });

        socket.on("set:shape", ({ room, ...shape }) => {
            if (room) socket.to(room).emit("set:shape", shape);
        });

        socket.on("update:shape", ({ room, ...shape }) => {
            if (room) socket.to(room).emit("update:shape", shape);
        });

        socket.on("delete:shape", ({ room, objectId }) => {
            if (room) socket.to(room).emit("delete:shape", { objectId });
        });

        socket.on("undo:shape", ({ room, status }) => {
            if (room) socket.to(room).emit("undo:shape", { status });
        });

        socket.on("redo:shape", ({ room, status }) => {
            if (room) socket.to(room).emit("redo:shape", { status });
        });

        socket.on("reset:canvas", ({ room, status }) => {
            if (room) socket.to(room).emit("reset:canvas", { status });
        });

        socket.on("cursor", ({ room, cursor }) => {
            if (room) socket.to(room).emit("cursor", { id: socket.id, ...cursor });
        });

        socket.on("disconnecting", () => {
            const socketRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

            socketRooms.forEach((room) => {
                const currRoom = rooms.get(room);

                if (currRoom) {
                    currRoom.removeUser(socket.id);
                    const restUsers = currRoom.getUsers();

                    if (restUsers.length === 0) {
                        rooms.delete(room);
                    } else {
                        io.in(room).emit("room:users", { users: restUsers });
                    }
                }
            });
        });
    });
};
