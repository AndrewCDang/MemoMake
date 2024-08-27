"use client";
import style from "./PinIcon.module.scss";
import { useState } from "react";
import { colours } from "@/app/styles/colours";
import { IoMdThumbsUp } from "react-icons/io";
import { addRemoveLike } from "@/app/_actions/addRemoveLike";
import { ContentType } from "@/app/_types/types";

type LikeIconTypes = {
    isLiked: boolean;
    userId: string;
    setId: string;
    revalidate?: boolean;
    contentType: ContentType;
};

const LikeIcon = ({
    isLiked = false,
    userId,
    setId,
    revalidate = true,
    contentType,
}: LikeIconTypes) => {
    const [likeIcon, setlikeIcon] = useState(isLiked);

    const handler = async () => {
        setlikeIcon((prevState) => {
            return !prevState;
        });
        const favouriteDb = await addRemoveLike({
            id: userId,
            setId: setId,
            contentType: contentType,
        });
    };
    return (
        <div
            onClick={() => handler()}
            className={`${style.likeIcon} ${
                likeIcon ? style.pinned : style.notPinned
            }`}
        >
            <IoMdThumbsUp
                style={{
                    fill: likeIcon ? colours.blueSelect() : colours.black(0.4),
                }}
            />
        </div>
    );
};

export default LikeIcon;
