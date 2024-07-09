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
    image: File | undefined;
    setImage: Dispatch<SetStateAction<File | undefined>>;
};

export const uploadImageHandler = async (
    image: File
): Promise<{ url: string } | null | undefined> => {
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

function UploadImage({ image, setImage }: UploadImageTypes) {
    const [imageUrl, setImageUrl] = useState<string>("");

    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const image = e.target.files[0] as File;
            setImage(image);
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
            if (!contentType || !contentType.startsWith("image/")) {
                throw new Error("URL does not point to an image");
            }
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", {
                type: blob.type,
            });

            setImage(file);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setUrlError(true);
                console.log(error.message);
            }
        }
    };

    return (
        <div className={style.imageformUploadContainer}>
            {image && (
                <img
                    className={style.uploadedImagePreview}
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                />
            )}
            {image && (
                <span className={style.imageNameLabel}>{image.name}</span>
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
                {urlError && (
                    <span className={style.error}>
                        Invalid URL | URL does not directly point to image
                    </span>
                )}
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
