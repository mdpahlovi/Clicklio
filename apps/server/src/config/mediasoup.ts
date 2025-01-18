import mediasoup from "mediasoup";
import { config } from "./config.js";

let workers: mediasoup.types.Worker<mediasoup.types.AppData>[];

const createWorker = async () => {
    let { numWorkers } = config.mediasoup;

    for (let i = 0; i < numWorkers; i++) {
        let worker = await mediasoup.createWorker({
            logLevel: config.mediasoup.worker.logLevel,
            logTags: config.mediasoup.worker.logTags,
            rtcMinPort: config.mediasoup.worker.rtcMinPort,
            rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
        });

        worker.on("died", () => {
            console.error("mediasoup worker died, exiting in 2 seconds... [pid:%d]", worker.pid);
            setTimeout(() => process.exit(1), 2000);
        });

        workers.push(worker);

        // log worker resource usage
        setInterval(async () => {
            const usage = await worker.getResourceUsage();

            console.info("mediasoup Worker resource usage [pid:%d]: %o", worker.pid, usage);
        }, 120000);
    }
};

export { createWorker, workers };
