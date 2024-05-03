import { v2 as cloudinary } from "cloudinary";
import { GraphQLError } from "graphql";

export async function uploadImage(image: string, folder: string) {
    const result = await cloudinary.uploader.upload(image, { folder: `Clicklio/${folder}` });
    if (!result) throw new GraphQLError("Failed To Upload Image", { extensions: { code: "BAD_REQUEST" } });
    return result.secure_url;
}
