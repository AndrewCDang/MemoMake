"use client";
import { useForm } from "react-hook-form";
import Button from "@/app/_components/(buttons)/styledButton";
import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
} from "react";
import InputField from "@/app/_components/input/inputField";
import { useState, useRef } from "react";
import type { CreateSetType } from "@/schema/setSchema";
import { CreateSetSchema } from "@/schema/setSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessionServer } from "@/app/_actions/useSessionAction";
import { insertSet } from "@/app/_actions/insertSet";
import { toastNotify } from "@/app/(toast)/toast";
import CategoryInput from "@/app/_components/categoryInput/labelInput";
import style from "./createSetModal.module.scss";

type CreateSetTypes = {
    setModal: Dispatch<SetStateAction<boolean>>;
};

function CreateSetModal({ setModal }: CreateSetTypes) {
    const [categories, setCategories] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [typedCategory, setTypedCategory] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        getValues,
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
                await insertSet({ data, id });
                reset();
                setCategories([]);
                toastNotify("Created new flashcard set");
                setModal(false);
            } catch (error) {}
        }
        setLoading(false);
    };

    const categoryHandler = (categories: string[]) => {
        setValue("categories", categories as [string, ...string[]]);
    };

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory) {
            const submitCategory = [...categories, typedCategory];
            console.log(submitCategory);
            setValue("categories", submitCategory);
        }
        handleSubmit(submitForm)();
    };

    return (
        <section>
            <form
                className={style.formContainer}
                ref={formRef}
                onSubmit={handleSubmit((data) => submitForm(data))}
            >
                <InputField
                    id="create_set_id"
                    type="text"
                    placeholder="Set Name"
                    object="setName"
                    error={errors.setName ? true : false}
                    errorMessage={errors.setName && errors.setName.message}
                    register={register}
                />

                <InputField
                    id="create_set_description"
                    type="text"
                    placeholder="Description"
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
