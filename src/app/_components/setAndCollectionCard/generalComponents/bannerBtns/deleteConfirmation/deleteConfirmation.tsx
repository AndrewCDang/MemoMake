"use client";
import style from "./deleteConfirmation.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { ContentType } from "@/app/_types/types";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { HiMiniTrash } from "react-icons/hi2";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { delSetOrCollection } from "@/app/_actions/delSetOrCollection";

type DeleteConfirmationTypes = {
    id: string;
    contentType: ContentType;
    isOn: boolean;
    setIsOn: Dispatch<SetStateAction<boolean>>;
};

function DeleteConfirmation({
    id,
    contentType,
    isOn,
    setIsOn,
}: DeleteConfirmationTypes) {
    const ref = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(false);

    const offClick = (e: MouseEvent) => {
        if (
            isMountedRef.current === true &&
            ref.current &&
            !ref.current.contains(e.target as Node)
        ) {
            setIsOn(false);
        }
    };

    useEffect(() => {
        if (ref.current && isOn) {
            window.addEventListener("click", offClick);
            setTimeout(() => {
                isMountedRef.current = true;
            }, 0);
            return () => {
                if (ref.current) {
                    window.removeEventListener("click", offClick);
                }
            };
        }
    }, [isOn]);

    // Delete Handler
    const delHandler = async () => {
        const del = await delSetOrCollection({ id, contentType });
        console.log(del);
    };

    return (
        <div ref={ref} className={style.delConfirmationContainer}>
            <div className={style.delText}>
                <HiMiniTrash />
                <span>Delete {capitaliseFirstChar(contentType)}?</span>
            </div>
            <div className={style.delBtns}>
                <DefaultButton handler={() => setIsOn(false)}>No</DefaultButton>
                <DefaultButton
                    handler={() => (setIsOn(false), delHandler())}
                    variant="red"
                >
                    Yes
                </DefaultButton>
            </div>
        </div>
    );
}

export default DeleteConfirmation;
