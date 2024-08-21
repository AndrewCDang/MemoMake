"use client";

import React, {
    ChangeEvent,
    Dispatch,
    MouseEvent,
    SetStateAction,
    useState,
} from "react";
import style from "./uploadImage.module.scss";
import { LuUpload } from "react-icons/lu";
import DefaultButton from "../(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";

type UploadImageTypes = {
    insertOnUpload?: boolean;
    onUploadHandler?: () => void;
    showImage?: boolean;
    image: File | null | undefined;
    exisitingImage?: string | null;
    setImage: Dispatch<SetStateAction<File | null | undefined>>;
};

export const uploadImageHandler = async (
    image: File | null
): Promise<{ url: string; image_id: string } | null | undefined> => {
    if (image) {
        const formData = new FormData();
        formData.append("image", image);

        console.log(image);
        try {
            const res = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const json = await res.json();

            return json;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};

function UploadImage({
    insertOnUpload = false,
    onUploadHandler = () => null,
    showImage = true,
    exisitingImage,
    image,
    setImage,
}: UploadImageTypes) {
    const [imageUrl, setImageUrl] = useState<string>("");

    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const image = e.target.files[0] as File;
            setImage(image);
            onUploadHandler();
        }
    };

    // Image Url
    const [urlError, setUrlError] = useState<boolean>(false);

    const handleURLChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
    };

    const submitUrlHander = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();
        try {
            if (urlError) setUrlError(false);
            const response = await fetch(imageUrl);

            if (!response.ok) {
                throw new Error("Network Response not OK");
            }

            const contentType = response.headers.get("content-type");
            console.log(contentType);
            if (!contentType || !contentType.startsWith("image/")) {
                throw new Error("URL does not point to an image");
            }

            const urlParts = imageUrl.split("/");
            const imageName = urlParts[urlParts.length - 1] || "image.jpg";

            const blob = await response.blob();
            const file = new File([blob], imageName, {
                type: blob.type,
            });
            setImage(file);
            onUploadHandler();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setUrlError(true);
                console.log(error.message);
            }
        }
    };

    return (
        <div className={style.imageformUploadContainer}>
            {exisitingImage && !image && (
                <img
                    className={style.uploadedImagePreview}
                    src={exisitingImage}
                    alt={"existing_collection_image"}
                />
            )}
            {showImage && image && (
                <>
                    <img
                        className={style.uploadedImagePreview}
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                    />
                    <span className={style.imageNameLabel}>{image.name}</span>
                </>
            )}

            <div className={style.inputUrlContainer}>
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        placeholder="Paste image url"
                        value={imageUrl}
                        onChange={handleURLChange}
                    ></input>
                    <DefaultButton variant="Black" handler={submitUrlHander}>
                        <HiChevronRight />
                    </DefaultButton>
                </div>
                {urlError && <span className={style.error}>Invalid URL</span>}
            </div>
            <span>or</span>
            <div>
                <input
                    id="uploadImage"
                    accept="image/*"
                    onChange={onChangeHandler}
                    type="file"
                ></input>
                <label htmlFor="uploadImage">
                    <LuUpload />
                    <span>Upload Image</span>
                </label>
            </div>
        </div>
    );
}

export default UploadImage;
