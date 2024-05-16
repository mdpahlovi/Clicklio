import http from "http";
import { Server } from "socket.io";
const httpServer = http.createServer();

const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join:room", ({ room }) => {
        if (room) socket.join(room);
    });

    socket.on("leave:room", ({ room }) => {
        if (room) socket.leave(room);
    });

    socket.on("set:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.to(room).emit("set:shape", shape);
    });
    socket.on("update:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.emit("update:shape", shape);
    });
    socket.on("delete:shape", ({ room, objectId }) => {
        if (room) socket.broadcast.emit("delete:shape", { objectId });
    });
    socket.on("undo:shape", ({ room, status }) => {
        if (room) socket.broadcast.emit("undo:shape", { status });
    });
    socket.on("redo:shape", ({ room, status }) => {
        if (room) socket.broadcast.emit("redo:shape", { status });
    });

    socket.on("cursor", ({ room, cursor }) => {
        if (room) socket.broadcast.to(room).emit("cursor", { ...cursor });
    });
});

httpServer.listen(4000, () => console.log(`🚀 Server Running On http://localhost:${4000}`));
