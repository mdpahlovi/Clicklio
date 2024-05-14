import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
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

const { name, api_key, api_secret } = config.cloud;
cloudinary.config({ cloud_name: name, api_key, api_secret });

app.use(cors(), bodyParser.json({ limit: "64mb" }), expressMiddleware(server));

const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join:room", ({ room }) => {
        if (room) socket.join(room);
    });

    socket.on("set:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.to(room).emit("set:shape", shape);
    });
    socket.on("update:shape", ({ room, ...shape }) => {
        if (room) socket.broadcast.emit("update:shape", shape);
    });
    socket.on("delete:shape", ({ room, objectId }) => {
        if (room) socket.broadcast.emit("delete:shape", { objectId });
    });
    socket.on("undo:shape", ({ room, status }) => {
        if (room) socket.broadcast.emit("undo:shape", { status });
    });
    socket.on("redo:shape", ({ room, status }) => {
        if (room) socket.broadcast.emit("redo:shape", { status });
    });

    socket.on("cursor", ({ room, cursor }) => {
        if (room) socket.broadcast.to(room).emit("cursor", { id: socket.id, ...cursor });
    });
});

httpServer.listen(config.port, () => console.log(`🚀 Server Running On http://localhost:${config.port}`));
