import fs from "fs";
import http from "httpolyglot";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config/config.js";
import { createWorker } from "./config/mediasoup.js";
import { connectRedis } from "./config/redis.js";
import { setupSocket } from "./services/socketService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    key: fs.readFileSync(path.join(__dirname, config.sslKey), "utf-8"),
    cert: fs.readFileSync(path.join(__dirname, config.sslCrt), "utf-8"),
};

const httpServer = http.createServer(options);

(async (): Promise<void> => {
    await connectRedis();
    await createWorker();

    setupSocket(httpServer);

    const PORT = config.listenPort;
    httpServer.listen(PORT, () => console.log(`🚀 Server Running On https://localhost:${PORT}`));
})();
