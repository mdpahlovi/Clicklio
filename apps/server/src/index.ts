import http from "http";
import { createClient } from "redis";
import { Server } from "socket.io";
import { generateName } from "./utils/ulits.js";

const httpServer = http.createServer();
const client = createClient({
    url: "rediss://red-ct5snqjqf0us738911hg:9NqvFG2h1iK7xD4BPBqdB9pbZyW6ayKz@singapore-redis.render.com:6379",
});

client.on("error", (error) => console.log("Redis Client Error", error));

await client.connect();

const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join:room", async ({ room }) => {
        if (room) {
            socket.join(room);
            await client.lPush(`${room}_users`, JSON.stringify({ id: socket.id, name: generateName() }));
            io.to(room).emit("users", { users: await client.lRange(`${room}_users`, 0, -1) });
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
                io.to(room).emit("users", { users: await client.lRange(`${room}_users`, 0, -1) });
            }
        }
    });

    socket.on("set:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.to(room).emit("set:shape", shape);
    });
    socket.on("update:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.to(room).emit("update:shape", shape);
    });
    socket.on("delete:shape", ({ room, objectId }) => {
        if (room) socket.broadcast.to(room).emit("delete:shape", { objectId });
    });
    socket.on("undo:shape", ({ room, status }) => {
        if (room) socket.broadcast.to(room).emit("undo:shape", { status });
    });
    socket.on("redo:shape", ({ room, status }) => {
        if (room) socket.broadcast.to(room).emit("redo:shape", { status });
    });
    socket.on("reset:canvas", ({ room, status }) => {
        if (room) socket.broadcast.to(room).emit("reset:canvas", { status });
    });

    socket.on("cursor", ({ room, cursor }) => {
        if (room) socket.broadcast.to(room).emit("cursor", { id: socket.id, ...cursor });
    });

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
                io.to(room).emit("users", { users: await client.lRange(`${room}_users`, 0, -1) });
            }
        }
    });
});

httpServer.listen(4000, () => console.log(`🚀 Server Running On http://localhost:4000`));
