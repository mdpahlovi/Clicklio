import http from "http";
import mediasoup from "mediasoup";
import { Server } from "socket.io";
import { config } from "./config/config.js";
import { createWorker } from "./config/mediasoup.js";
import { connectRedis } from "./config/redis.js";
import { handleConnection } from "./events/socketHandlers.js";

const httpServer = http.createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });
const workers: mediasoup.types.Worker[] = [];

(async (): Promise<void> => {
    await connectRedis();
    await createWorker(workers);

    handleConnection(io, workers[workers.length - 1]);

    const PORT = config.listenPort;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On https://localhost:${PORT}`));
})();
