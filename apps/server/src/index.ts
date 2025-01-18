import fs from "fs";
import http from "httpolyglot";
import path from "path";
import { config } from "./config/config.js";
import { createWorker } from "./config/mediasoup.js";
import { connectRedis } from "./config/redis.js";
import { setupSocket } from "./services/socketService.js";

const options = {
    key: fs.readFileSync(path.join(__dirname, config.sslKey), "utf-8"),
    cert: fs.readFileSync(path.join(__dirname, config.sslCrt), "utf-8"),
};

const httpServer = http.createServer(options);

(async (): Promise<void> => {
    await connectRedis();
    await createWorker();

    setupSocket(httpServer);

    const PORT: number = 4000;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On http://localhost:${PORT}`));
})();
