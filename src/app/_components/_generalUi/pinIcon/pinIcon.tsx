"use client";
import { AiFillPushpin } from "react-icons/ai";
import style from "./PinIcon.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";
import { colours } from "@/app/styles/colours";
import { ContentType } from "@/app/_types/types";

type PinIconTypes = {
    favourited: boolean;
    userId: string;
    setId: string;
    contentType: ContentType;
    revalidate?: boolean;
};

const PinIcon = ({
    favourited,
    userId,
    setId,
    contentType,
    revalidate = true,
}: PinIconTypes) => {
    const handler = async () => {
        const favouriteDb = await addRemoveFavourites({
            id: userId,
            contentType: contentType,
            setId: setId,
        });
    };
    return (
        <div
            onClick={() => handler()}
            className={`${style.pinIcon} ${
                favourited ? style.pinned : style.notPinned
            }`}
        >
            <AiFillPushpin
                style={{
                    fill: favourited ? colours.blueSelect() : colours.grey(),
                }}
            />
        </div>
    );
};

export default PinIcon;
