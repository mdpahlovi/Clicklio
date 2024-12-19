import { Server } from "socket.io";
import { handleConnection } from "../events/socketHandlers.js";

export const setupSocket = (httpServer: any): Server => {
    const io = new Server(httpServer, { cors: { origin: "*" } });

    handleConnection(io);

    return io;
};
