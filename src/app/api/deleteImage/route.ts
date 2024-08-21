import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadTypes = {};
export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const imageId = url.searchParams.get("imageId");

        if (imageId) {
            try {
                await cloudinary.uploader
                    .destroy(imageId, { resource_type: "image" })
                    .then(function (result) {
                        console.log(result);
                    });
                return NextResponse.json({ message: "Image deleted" });
            } catch (error) {
                console.log(error);
                return NextResponse.json({
                    message: "Error: Could not delete image",
                });
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}
