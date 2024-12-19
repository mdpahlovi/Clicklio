import http from "http";
import { connectRedis } from "./config/redis.js";
import { setupSocket } from "./services/socketService.js";

const httpServer = http.createServer();

(async (): Promise<void> => {
    await connectRedis();
    setupSocket(httpServer);

    const PORT: number = 4000;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On http://localhost:${PORT}`));
})();
