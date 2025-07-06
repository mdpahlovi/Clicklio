import http from "http";
import mediasoup from "mediasoup";
import { Server } from "socket.io";
import { config } from "./config/index.js";
import { handleConnection } from "./events/socketHandlers.js";

const httpServer = http.createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });
const workers: mediasoup.types.Worker[] = [];

(async (): Promise<void> => {
    handleConnection(io, workers[workers.length - 1]);

    const PORT = config.port;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On https://localhost:${PORT}`));
})();
