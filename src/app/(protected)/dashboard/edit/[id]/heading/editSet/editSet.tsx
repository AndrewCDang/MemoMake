"use client";
import { toastNotify } from "@/app/(toast)/toast";
import LabelInput from "@/app/_components/categoryInput/labelInput";
import FormInputField from "@/app/_components/input/formInputField";
import { Flashcard_set } from "@/app/_types/types";
import {
    UpdateSetSchema,
    UpdateSetTypes,
    UpdateSetOptionsTypes,
} from "@/schema/updateSetScehma";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import style from "./editSet.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";
import Button from "@/app/_components/(buttons)/styledButton";
import SubmitMessage from "@/app/(auth)/_components/submitResults/submitMessage";
import PublicAccessBtn from "../../../(components)/publicAccessBtn";
import UploadImage, {
    uploadImageHandler,
} from "@/app/_components/uploadImage/uploadImage";
import { updateSet } from "@/app/_actions/updateSet";

type EditSetTypes = {
    set: Flashcard_set;
};

function EditSet({ set }: EditSetTypes) {
    const {
        register,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch,
        handleSubmit,
    } = useForm<UpdateSetTypes>({
        resolver: zodResolver(UpdateSetSchema),
        mode: "onChange",
    });
    const [publicAccess, setPublicAccess] = useState(
        set.public_access || false
    );
    const [categories, setCategoires] = useState<string[]>(
        set.set_categories || []
    );
    const [image, setImage] = useState<File | null | undefined>(null);

    useEffect(() => {
        console.log(image);
    }, [image]);

    const formRef = useRef<HTMLFormElement>(null);
    const [typedCategory, setTypedCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const categoryHandler = (categories: string[]) => {
        setValue("set_categories", categories as [string, ...string[]]);
    };

    const errorSubmit = (error: any) => {
        console.log(error);
    };

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory && !categories.includes(typedCategory)) {
            const submitCategory = [...categories, typedCategory];
            console.log(submitCategory);
            setValue("set_categories", submitCategory);
        }
        handleSubmit(updateCard, errorSubmit)();
    };

    // Touched = if any input fields have been changed
    const defaultItems = [
        set.set_name,
        set.set_categories.join("-"),
        set.description,
    ];
    const editedItems = [
        watch("set_name") || set.set_name,
        categories.join("-"),
        watch("description") || set.description,
    ];

    const touched = editedItems.some(
        (item, index) => item !== defaultItems[index]
    );

    // Update Set
    const updateCard = async (data: UpdateSetTypes) => {
        setIsLoading(true);
        if (touched) {
            const updatedSet = await updateSet({
                setId: set.id,
                name: data.set_name,
                categories: data.set_categories,
                description: data.description,
            });
            if (updatedSet) {
                toastNotify(updatedSet.message);
            }
        }
        if (image) {
            // Deletes Existing image
            if (set.image_id) {
                const deleteImage = await fetch(
                    `/api/deleteImage?imageId=${set.image_id}`,
                    {
                        method: "DELETE",
                    }
                );
                if (deleteImage.ok) {
                    console.log("Exisitng Image Deleted");
                }
            }
            // Uploads and updates image
            const uploadedImage = await uploadImageHandler(image);
            if (uploadedImage) {
                const image_id = uploadedImage.image_id;
                const imageUrl = uploadedImage.url;
                const updateImage = await updateSet({
                    setId: set.id,
                    image: imageUrl,
                    image_id: image_id,
                });
                if (updateImage) {
                    console.log(updateImage.message);
                }
            }
            setImage(null);
        }
        setIsLoading(false);
    };
    return (
        <div className={style.modalWrap}>
            <PublicAccessBtn
                flashcard_set={set}
                publicAccess={publicAccess}
                setPublicAccess={setPublicAccess}
            />
            <form
                onSubmit={preSubmitHandler}
                ref={formRef}
                className={style.editModal}
            >
                <UploadImage
                    image={image}
                    setImage={setImage}
                    exisitingImage={set.image}
                />
                <FormInputField<UpdateSetOptionsTypes>
                    id="set_name"
                    object="set_name"
                    type="text"
                    register={register}
                    defaultValue={set.set_name || ""}
                ></FormInputField>
                <FormInputField<UpdateSetOptionsTypes>
                    textarea={true}
                    id="description"
                    object="description"
                    type="text"
                    register={register}
                    defaultValue={set.description || ""}
                ></FormInputField>
                <LabelInput
                    categories={categories}
                    setCategories={setCategoires}
                    formRef={formRef}
                    categoryHandler={categoryHandler}
                    setTypedCategory={setTypedCategory}
                />
                <Button
                    disabled={!touched && image == null}
                    loading={isLoading}
                    text="Make Changes"
                />
            </form>
        </div>
    );
}

export default EditSet;
