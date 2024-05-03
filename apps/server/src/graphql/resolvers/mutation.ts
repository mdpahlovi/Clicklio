import Canvas from "../../models/canvas/index.js";
import { Element } from "../../models/canvas/interface.js";
import { uploadImage } from "../../utils/uploadImage.js";

type UpdateCanvas = { image: string; elements: Element[] };

export const Mutation = {
    createCanvas: async (parent: any, args: { code: string; name: string }) => {
        const newCanvas = new Canvas(args);
        return await newCanvas.save();
    },
    updateCanvas: async (parent: any, { code, data }: { code: string; data: UpdateCanvas }) => {
        if (data?.image) data.image = await uploadImage(data.image, "Canvas");
        return await Canvas.findOneAndUpdate({ code }, data, { new: true });
    },
    deleteCanvas: async (parent: any, { code }: { code: string }) => await Canvas.findOneAndDelete({ code }),
};
