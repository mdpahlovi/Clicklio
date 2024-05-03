import path from "path";
import { config } from "dotenv";
config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT,
    mongodb_url: process.env.MONGODB_URL,
    cloud: {
        name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};
