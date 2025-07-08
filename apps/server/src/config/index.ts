import dotenv from "dotenv";
dotenv.config();

export const config = {
    node: process.env.NODE_ENV,
    port: process.env.PORT,
};
