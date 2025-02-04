import { types } from "mediasoup";
import { Server } from "socket.io";
import { Room } from "../classes/room.js";

export const handleConnection = (io: Server, worker: types.Worker) => {
    const rooms: Map<string, Room> = new Map();

    io.on("connection", (socket) => {
        /**
         * When a user joins a room, add the user to the room.
         * If the room does not exist, create a new room.
         * Emit the updated list of users to all other users in the room.
         */
        socket.on("join:room", ({ room, name }) => {
            if (room) {
                socket.join(room);
                if (!rooms.has(room)) rooms.set(room, new Room());

                const currRoom = rooms.get(room);
                const userData = currRoom.addUser(socket.id, name);

                io.in(room).emit("room:users", { users: currRoom.getUsers(), to: userData.id });
            }
        });

        /**
         * When a user leaves a room, remove the user from the room.
         * If the room is empty, remove the room.
         * Emit the updated list of users to all other users in the room.
         */
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

        /**
         * When a user updates their name, update the name in the room.
         * Emit the updated name to all other users in the room.
         */
        socket.on("update:name", ({ room, name }) => {
            if (room) {
                const currRoom = rooms.get(room);

                if (currRoom) {
                    currRoom.updateName(socket.id, name);
                    socket.to(room).emit("update:name", { id: socket.id, name });
                }
            }
        });

        /**
         * Canvas events
         * 'initial:state' this sent the room state to the newly joined user
         * 'set:shape' this is sent to the room when a user makes a shape
         * 'update:shape' this is sent to the room when a user updates a shape
         * 'delete:shape' this is sent to the room when a user deletes a shape
         * 'undo:shape' this is sent to the room when a user undoes a shape
         * 'redo:shape' this is sent to the room when a user redoes a shape
         * 'reset:canvas' this is sent to the room when a user resets the canvas
         * 'cursor' this is sent to the room when a user moves the cursor
         */
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
        // Canvas events end

        /**
         * Video calling and chatting events
         * 'call:peer' this is sent to the room when a user start a group call
         * 'call:accepted' this is sent to the room when a user accepts a call from another user
         * 'call:rejected' this is sent to the room when a user rejects a call from another user
         * 'call:ended' this is sent to the room when a user ends a call with another user
         */
        socket.on("call:peer", () => {});
        socket.on("call:accepted", () => {});
        socket.on("call:rejected", () => {});
        socket.on("call:ended", () => {});
        // Video calling and chatting events end

        /**
         * Socket disconnecting Event
         * When a user disconnects, remove the user from the room.
         * If room is empty, delete the room also.
         * Emit the updated list of users to all other users in the room.
         */
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
