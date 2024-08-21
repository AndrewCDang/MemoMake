import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadTypes = {
    image: File;
};
export async function POST(
    request: { json: () => Promise<UploadTypes> } | any
) {
    try {
        const formData = await request.formData();
        const images = formData.get("image") as File;
        const arrayBuffer = await images.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        let url: string = "";
        let publicId: string = "";
        await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        tags: ["n"],
                        upload_preset: "test",
                    },
                    function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        url = result?.url || "";
                        publicId = result?.public_id || "";
                        resolve(result);
                    }
                )
                .end(buffer);
        });

        console.log(url);
        if (url) {
            return NextResponse.json({ url: url, image_id: publicId });
        } else {
            return NextResponse.json({ url: null, image_id: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}
