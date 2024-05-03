import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";

import config from "./config/index.js";
import { typeDefs } from "./graphql/schemas/index.js";
import { resolvers } from "./graphql/resolvers/index.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
await mongoose.connect(config.mongodb_url);
cloudinary.config({ cloud_name: config.cloud.name, api_key: config.cloud.api_key, api_secret: config.cloud.api_secret });

app.use(cors(), bodyParser.json({ limit: "64mb" }), expressMiddleware(server));
httpServer.listen(config.port, () => console.log(`🚀 Server Running On http://localhost:${config.port}`));
