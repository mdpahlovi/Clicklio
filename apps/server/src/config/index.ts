import dotenv from 'dotenv';
dotenv.config();

export const config = {
    node: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
};