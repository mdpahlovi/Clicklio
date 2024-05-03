import mongoose, { Schema } from "mongoose";
import { CanvasModel, ICanvas } from "./interface.js";

const canvasSchema = new Schema<ICanvas>(
    {
        code: { type: String, unique: true },
        name: String,
        image: String,
        elements: [
            {
                offsetX: Number,
                offsetY: Number,
                path: [[Number, Number]],
                width: Number,
                height: Number,
                stroke: String,
                tool: String,
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<ICanvas, CanvasModel>("canvas", canvasSchema);
