"use client";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import Button from "@/app/_components/(buttons)/styledButton";
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import FormInputField from "@/app/_components/input/formInputField";
import { useState, useRef } from "react";
import type { CreateSetType } from "@/schema/setSchema";
import { CreateSetSchema } from "@/schema/setSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessionServer } from "@/app/_actions/useSessionAction";
import { insertSet } from "@/app/_actions/insertSet";
import { toastNotify } from "@/app/(toast)/toast";
import CategoryInput from "@/app/_components/categoryInput/labelInput";
import style from "./createSetModal.module.scss";
import UploadImage from "@/app/_components/uploadImage/uploadImage";
import { uploadImageHandler } from "@/app/_components/uploadImage/uploadImage";
import ColourSwatchPicker from "@/app/_components/colourSwatchPicker/colourSwatchPicker";
import { coloursType } from "@/app/styles/colours";
import ColourThemeBanner from "../sharedComponents/colourThemeBanner/colourThemeBanner";

type CreateSetTypes = {
    setModal: Dispatch<SetStateAction<boolean>>;
};

function CreateSetModal({ setModal }: CreateSetTypes) {
    const [categories, setCategories] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [typedCategory, setTypedCategory] = useState<string>("");
    const [image, setImage] = useState<File>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm<CreateSetType>({
        resolver: zodResolver(CreateSetSchema),
        mode: "onChange",
    });

    const submitForm = async (data: CreateSetType) => {
        setLoading(true);
        const session = await useSessionServer();
        const id = session?.id;
        if (id) {
            try {
                const uploadImageRetrieveUrl = image
                    ? await uploadImageHandler(image)
                    : null;

                const url = uploadImageRetrieveUrl
                    ? uploadImageRetrieveUrl.url
                    : null;

                await insertSet({ data, id, imageUrl: url });
                reset();
                setCategories([]);
                toastNotify("Created new flashcard set");
                setModal(false);
                setSelectedColour("white");
            } catch (error) {}
        }
        setLoading(false);
    };

    const categoryHandler = (categories: string[]) => {
        setValue("categories", categories as [string, ...string[]]);
    };

    const [selectedColour, setSelectedColour] = useState<coloursType>("white");

    const colourSwatchHandler = (id: string, col: coloursType) => {
        setSelectedColour(col);
        setValue("colours", col);
    };

    const displayError: SubmitErrorHandler<{
        setName: string;
        description: string;
        categories: string[];
    }> = (errors) => {
        console.log(errors);
    };

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory) {
            const submitCategory = [...categories, typedCategory];
            console.log(submitCategory);
            setValue("categories", submitCategory);
        }
        handleSubmit(submitForm, displayError)();
    };

    return (
        <section>
            <form
                className={style.formContainer}
                ref={formRef}
                onSubmit={handleSubmit((data) => submitForm(data))}
            >
                <FormInputField
                    id="create_set_id"
                    labelText="Set Name"
                    type="text"
                    object="setName"
                    error={errors.setName ? true : false}
                    errorMessage={errors.setName && errors.setName.message}
                    register={register}
                />
                <UploadImage image={image} setImage={setImage} />
                <ColourThemeBanner col={selectedColour} />
                <div className={style.colourSwatchWrap}>
                    <label>Set Colour</label>
                    <ColourSwatchPicker
                        id="setModal"
                        selected={selectedColour}
                        handler={colourSwatchHandler}
                    />
                </div>
                <div>
                    <FormInputField
                        id="create_set_description"
                        labelText="Set Description"
                        type="text"
                        object="description"
                        error={errors.description ? true : false}
                        errorMessage={
                            errors.description && errors.description.message
                        }
                        register={register}
                    />
                    <CategoryInput
                        categories={categories}
                        setTypedCategory={setTypedCategory}
                        setCategories={setCategories}
                        categoryHandler={categoryHandler}
                        formRef={formRef}
                    />
                </div>

                <Button
                    handler={(e) => {
                        e.preventDefault();
                        preSubmitHandler(e);
                    }}
                    loading={isLoading}
                    text="Submit"
                />
            </form>
        </section>
    );
}

export default CreateSetModal;
