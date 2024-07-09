"use client";
import { toastNotify } from "@/app/(toast)/toast";
import { updateFlashSetSetting } from "@/app/_actions/updateFlashSetSetting";
import LabelInput from "@/app/_components/categoryInput/labelInput";
import FormInputField from "@/app/_components/input/formInputField";
import { Flashcard_set } from "@/app/_types/types";
import {
    UpdateSetSchema,
    UpdateSetTypes,
    UpdateSetOptionsTypes,
} from "@/schema/updateSetScehma";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import style from "./editSet.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";
import Button from "@/app/_components/(buttons)/styledButton";
import SubmitMessage from "@/app/(auth)/_components/submitResults/submitMessage";
import PublicAccessBtn from "../../../(components)/publicAccessBtn";

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

    const [categories, setCategoires] = useState<string[]>(
        set.set_categories || []
    );
    const formRef = useRef<HTMLFormElement>(null);
    const [typedCategory, setTypedCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const categoryHandler = (categories: string[]) => {
        setValue("set_categories", categories as [string, ...string[]]);
    };

    // Update Set
    const updateCard = async (data: UpdateSetTypes) => {
        setIsLoading(true);
        const updateSet = await updateFlashSetSetting({
            id: set.id,
            set_name: data.set_name,
            set_categories: data.set_categories,
            description: data.description,
        });
        console.log(updateSet.message);
        if (updateSet.success) {
            toastNotify(updateSet.message);
        }
        setIsLoading(false);
    };

    const errorSubmit = (error: any) => {
        console.log(error);
    };

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory) {
            const submitCategory = [...categories, typedCategory];
            console.log(submitCategory);
            setValue("set_categories", submitCategory);
        }
        handleSubmit(updateCard, errorSubmit)();
    };

    const touched = () => {
        const defaultItems = [
            set.set_name,
            set.set_categories.join("-"),
            set.description,
        ];
        const editedItems = [
            watch().set_name,
            categories.join("-"),
            watch().description,
        ];

        const condition = editedItems.some(
            (item, index) => item !== defaultItems[index]
        );

        return condition;
    };

    return (
        <div className={style.modalWrap}>
            <PublicAccessBtn flashcard_set={set} />
            <form
                onSubmit={preSubmitHandler}
                ref={formRef}
                className={style.editModal}
            >
                <FormInputField<UpdateSetOptionsTypes>
                    id="set_name"
                    type="text"
                    register={register}
                    defaultValue={set.set_name || ""}
                ></FormInputField>
                <FormInputField<UpdateSetOptionsTypes>
                    textarea={true}
                    id="description"
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
                    disabled={!touched()}
                    loading={isLoading}
                    text="Make Changes"
                />
            </form>
        </div>
    );
}

export default EditSet;
