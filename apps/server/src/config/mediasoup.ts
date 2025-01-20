import mediasoup from "mediasoup";
import { config } from "./config.js";

const createWorker = async (workers: mediasoup.types.Worker[]) => {
    let { numWorkers } = config.mediasoup;

    for (let i = 0; i < numWorkers; i++) {
        const worker = await mediasoup.createWorker({
            logLevel: config.mediasoup.worker.logLevel,
            logTags: config.mediasoup.worker.logTags,
        });

        worker.on("died", () => {
            console.error("mediasoup worker died, exiting in 2 seconds... [pid:%d]", worker.pid);
            setTimeout(() => process.exit(1), 2000);
        });

        workers.push(worker);

        // log worker resource usage
        // setInterval(async () => {
        //     const usage = await worker.getResourceUsage();

        //     console.info("mediasoup Worker resource usage [pid:%d]: %o", worker.pid, usage);
        // }, 120000);
    }
};

export { createWorker };
