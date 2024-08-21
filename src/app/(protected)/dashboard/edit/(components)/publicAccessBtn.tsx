"use client";
import { Flashcard_set } from "@/app/_types/types";
import style from "./publicAccessBtn.module.scss";
import { toggleSetPublicAccess } from "@/app/_actions/toggleSetPublicAccess";
import SliderToggle from "@/app/_components/sliderToggle/sliderToggle";
import { Dispatch, SetStateAction, useState } from "react";

const PublicAccessBtn = ({
    flashcard_set,
    publicAccess,
    setPublicAccess,
}: {
    flashcard_set: Flashcard_set;
    publicAccess: boolean;
    setPublicAccess: Dispatch<SetStateAction<boolean>>;
}) => {
    const togglePublicAccessHandler = async () => {
        setPublicAccess((prev) => !prev);
        const publicAccessResponse = await toggleSetPublicAccess({
            setId: flashcard_set.id,
        });
        console.log(publicAccessResponse);
    };

    return (
        <div className={style.publicAccessContainer}>
            <SliderToggle
                checked={publicAccess}
                name={"public_access"}
                handler={togglePublicAccessHandler}
                variant="coloured"
            />
            <span>Public Access</span>
        </div>
    );
};

export default PublicAccessBtn;
