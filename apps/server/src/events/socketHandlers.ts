import mediasoup from "mediasoup";
import { Server } from "socket.io";
import { Peer } from "../classes/peer.js";
import { VideoRoom } from "../classes/video-room.js";
import { client } from "../config/redis.js";
import { generateName } from "../utils/utils.js";

let VideoChatRoomList = new Map<string, VideoRoom>();

export const handleConnection = (io: Server, worker: mediasoup.types.Worker) => {
    io.on("connection", (socket) => {
        console.log("user connected", socket.id);

        socket.on("join:room", async ({ room, name }) => {
            if (room) {
                socket.join(room);

                const userData = { id: socket.id, name: name || generateName() };
                await client.rPush(`${room}_users`, JSON.stringify(userData));
                io.in(room).emit("room:users", { users: await client.lRange(`${room}_users`, 0, -1), to: userData.id });
            }
        });

        socket.on("leave:room", async ({ room }) => {
            if (room) {
                socket.leave(room);
                const users = await client.lRange(`${room}_users`, 0, -1);
                const userIndex = users.findIndex((u) => JSON.parse(u).id === socket.id);

                if (userIndex !== -1) await client.lRem(`${room}_users`, 0, users[userIndex]);

                const remainingUsers = await client.lLen(`${room}_users`);
                if (remainingUsers === 0) {
                    await client.del(`${room}_users`);
                } else {
                    io.in(room).emit("room:users", { users: await client.lRange(`${room}_users`, 0, -1) });
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

        /**
         * Video Chat
         * Start Here
         */
        socket.on("createRoom", async ({ room: roomId }, callback) => {
            if (VideoChatRoomList.has(roomId)) {
                callback("already exists");
            } else {
                console.log("Created room", { roomId: roomId });
                VideoChatRoomList.set(roomId, new VideoRoom(roomId, worker, io));
                callback(roomId);
            }
        });

        socket.on("join", ({ room: roomId, name }, cb) => {
            console.log("User joined", { roomId: roomId, name: name });

            if (!VideoChatRoomList.has(roomId)) {
                return cb({ error: "Room does not exist" });
            }

            VideoChatRoomList.get(roomId).addPeer(new Peer(socket.id, name));

            cb(VideoChatRoomList.get(roomId).toJson());
        });

        socket.on("getProducers", ({ room: roomId }) => {
            if (!VideoChatRoomList.has(roomId)) return;
            console.log("Get producers", { name: `${VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}` });

            // Send all the current producer to newly joined member
            let producerList = VideoChatRoomList.get(roomId).getProducerListForPeer();

            socket.emit("newProducers", producerList);
        });

        socket.on("getRouterRtpCapabilities", ({ room: roomId }, callback) => {
            console.log("Get RouterRtpCapabilities", {
                name: `${VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
            });

            try {
                callback(VideoChatRoomList.get(roomId).getRtpCapabilities());
            } catch (e) {
                callback({ error: e.message });
            }
        });

        socket.on("createWebRtcTransport", async ({ room: roomId }, callback) => {
            console.log("Create WebRTC transport", {
                name: `${VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
            });

            try {
                const { params } = await VideoChatRoomList.get(roomId).createWebRtcTransport(socket.id);

                callback(params);
            } catch (err) {
                console.error(err);
                callback({ error: err.message });
            }
        });

        socket.on("connectTransport", async ({ room: roomId, transport_id, dtlsParameters }, callback) => {
            console.log("Connect transport", { name: `${VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}` });

            if (!VideoChatRoomList.has(roomId)) return;
            await VideoChatRoomList.get(roomId).connectPeerTransport(socket.id, transport_id, dtlsParameters);

            callback("success");
        });

        socket.on("produce", async ({ room: roomId, kind, rtpParameters, producerTransportId }, callback) => {
            if (!VideoChatRoomList.has(roomId)) {
                return callback({ error: "not is a room" });
            }

            let producerId = await VideoChatRoomList.get(roomId).produce(socket.id, producerTransportId, rtpParameters, kind);

            console.log("Produce", {
                type: `${kind}`,
                name: `${VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
                id: `${producerId}`,
            });

            callback({ producerId });
        });

        socket.on("consume", async ({ room: roomId, consumerTransportId, producerId, rtpCapabilities }, callback) => {
            //TODO null handling
            let params = await VideoChatRoomList.get(roomId).consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

            console.log("Consuming", {
                name: `${VideoChatRoomList.get(roomId) && VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
                producerId: `${producerId}`,
                consumerId: `${params.id}`,
            });

            callback(params);
        });

        socket.on("getMyRoomInfo", ({ room: roomId }, cb) => {
            cb(VideoChatRoomList.get(roomId).toJson());
        });

        socket.on("producerClosed", ({ room: roomId, producerId }) => {
            console.log("Producer close", {
                name: `${VideoChatRoomList.get(roomId) && VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
            });

            VideoChatRoomList.get(roomId).closeProducer(socket.id, producerId);
        });

        socket.on("exitRoom", async ({ room: roomId }, callback) => {
            console.log("Exit room", {
                name: `${VideoChatRoomList.get(roomId) && VideoChatRoomList.get(roomId).getPeers().get(socket.id).name}`,
            });

            if (!VideoChatRoomList.has(roomId)) {
                callback({
                    error: "not currently in a room",
                });
                return;
            }
            // close transports
            await VideoChatRoomList.get(roomId).removePeer(socket.id);
            if (VideoChatRoomList.get(roomId).getPeers().size === 0) {
                VideoChatRoomList.delete(roomId);
            }

            callback("Successfully exited room");
        });
        /**
         * Video Chat
         * Start Here
         */

        socket.on("disconnecting", async () => {
            const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

            for (const room of rooms) {
                const users = await client.lRange(`${room}_users`, 0, -1);
                const userIndex = users.findIndex((u) => JSON.parse(u).id === socket.id);

                if (userIndex !== -1) await client.lRem(`${room}_users`, 0, users[userIndex]);

                const remainingUsers = await client.lLen(`${room}_users`);
                if (remainingUsers === 0) {
                    await client.del(`${room}_users`);
                } else {
                    io.in(room).emit("room:users", { users: await client.lRange(`${room}_users`, 0, -1) });
                }

                // Video
                console.log("Disconnect", {
                    name: `${VideoChatRoomList.get(room) && VideoChatRoomList.get(room).getPeers().get(socket.id).name}`,
                });

                if (!room) return;
                VideoChatRoomList.get(room).removePeer(socket.id);
            }
        });
    });
};
