"use client";

import React, { Dispatch, FormEvent, SetStateAction } from "react";
import style from "./set.module.scss";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthItemSchema, AuthItemTypes } from "@/schema/itemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/app/_components/input/inputField";
import Button from "@/app/_components/(buttons)/styledButton";
import RadioSelect from "@/app/_components/radioSelect/radioSelect";
import CornerClose from "@/app/_components/cornerClose/cornerClose";
import { toastNotify } from "@/app/(toast)/toast";
import insertFlashCard from "@/app/_actions/insertFlashCard";
import LabelInput from "@/app/_components/categoryInput/labelInput";

type CreateCardTypes = {
    setModalOn: Dispatch<SetStateAction<boolean>>;
    setId: string;
};

function CreateCardModal({ setModalOn, setId }: CreateCardTypes) {
    const [categories, setCategoires] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [typedCategory, setTypedCategory] = useState<string>("");

    // Form BoilerPlate
    const {
        register,
        formState: { errors },
        reset,
        setValue,
        handleSubmit,
    } = useForm<AuthItemTypes>({
        resolver: zodResolver(AuthItemSchema),
        mode: "onChange",
    });

    const submitCard = async (data: AuthItemTypes) => {
        setIsLoading(true);
        const insertDb = await insertFlashCard({ setId: setId, data: data });
        if (insertDb.success) {
            reset();
            setCategoires([]);
            setValue("difficulty", "NA");
            setValue("item_tags", []);
        }
        toastNotify(insertDb.message);
        setIsLoading(false);
    };

    const errorSubmit = (error: any) => {
        console.log(error);
    };

    const categoryHandler = (categories: string[]) => {
        setValue("item_tags", categories as [string, ...string[]]);
    };

    const difficultyHandler = (difficulty: string) => {
        switch (difficulty) {
            case "Unset":
                setValue("difficulty", "NA");
                break;

            case "Easy":
                setValue("difficulty", "EASY");
                break;

            case "Medium":
                setValue("difficulty", "MEDIUM");
                break;
            case "Hard":
                setValue("difficulty", "HARD");
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        setValue("difficulty", "NA");
        setValue("item_tags", []);
    }, []);

    // Handles close modal behaviour
    const containerHandler = (e: MouseEvent) => {
        if (modalRef.current) {
            if (!modalRef.current.contains(e.target as Node)) {
                setModalOn(false);
            }
        }
    };

    useEffect(() => {
        if (modalRef.current && containerRef.current) {
            containerRef.current.addEventListener("click", containerHandler);
        }
    }, [modalRef, containerRef]);

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory) {
            const submitCategory = [...categories, typedCategory];
            console.log(submitCategory);
            setValue("item_tags", submitCategory);
        }
        handleSubmit(submitCard, errorSubmit)();
    };

    return (
        <section ref={containerRef} className={style.cardModalContainer}>
            <section ref={modalRef} className={style.cardModal}>
                <form
                    className={style.formContainer}
                    ref={formRef}
                    onSubmit={handleSubmit(
                        (data) => submitCard(data),
                        errorSubmit
                    )}
                >
                    <CornerClose handler={() => setModalOn(false)} />
                    <h3>New Flash Card</h3>
                    <InputField
                        id="item_question"
                        type="text"
                        placeholder="Question"
                        object="item_question"
                        error={errors.item_question ? true : false}
                        errorMessage={
                            errors.item_question && errors.item_question.message
                        }
                        register={register}
                    />
                    <InputField
                        id="item_answer"
                        type="text"
                        placeholder="Answer"
                        object="item_answer"
                        textarea={true}
                        error={errors.item_answer ? true : false}
                        errorMessage={
                            errors.item_answer && errors.item_answer.message
                        }
                        register={register}
                    />
                    <div className={style.miscOptions}>
                        <LabelInput
                            categories={categories}
                            setCategories={setCategoires}
                            formRef={formRef}
                            categoryHandler={categoryHandler}
                            setTypedCategory={setTypedCategory}
                        />
                        <RadioSelect
                            handler={difficultyHandler}
                            options={["Unset", "Easy", "Medium", "Hard"]}
                        />
                    </div>
                    <Button
                        handler={(e) => {
                            e.preventDefault();
                            preSubmitHandler(e);
                        }}
                        loading={isLoading}
                        text="Create Card"
                    />
                </form>
            </section>
        </section>
    );
}

export default CreateCardModal;
