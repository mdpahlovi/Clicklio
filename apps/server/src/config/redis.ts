import { createClient } from "redis";

const REDIS_URL = "rediss://red-ct5snqjqf0us738911hg:9NqvFG2h1iK7xD4BPBqdB9pbZyW6ayKz@singapore-redis.render.com:6379";

const client = createClient({ url: REDIS_URL });

client.on("error", (error) => console.error("Redis Client Error", error));

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();

        console.error("Redis Client Connected");
    }
};

export { client, connectRedis };
