import http from "http";
import { connectRedis } from "./config/redis.js";
import { createWorker } from "./config/mediasoup.js";
import { setupSocket } from "./services/socketService.js";

const httpServer = http.createServer();

(async (): Promise<void> => {
    await connectRedis();
    await createWorker();

    setupSocket(httpServer);

    const PORT: number = 4000;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On http://localhost:${PORT}`));
})();
