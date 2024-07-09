"use client";
import { Flashcard_set } from "@/app/_types/types";
import style from "./publicAccessBtn.module.scss";
import { toggleSetPublicAccess } from "@/app/_actions/toggleSetPublicAccess";
import SliderToggle from "@/app/_components/sliderToggle/sliderToggle";

const PublicAccessBtn = ({
    flashcard_set,
}: {
    flashcard_set: Flashcard_set;
}) => {
    const togglePublicAccessHandler = async () => {
        const publicAccessResponse = await toggleSetPublicAccess({
            setId: flashcard_set.id,
        });
        console.log(publicAccessResponse);
    };

    return (
        <div className={style.publicAccessContainer}>
            <SliderToggle
                checked={
                    (flashcard_set && flashcard_set.public_access) || false
                }
                name={"public_access"}
                handler={togglePublicAccessHandler}
                variant="coloured"
            />
            <span>Public Access</span>
        </div>
    );
};

export default PublicAccessBtn;
