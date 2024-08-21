"use client";
import { AiFillPushpin } from "react-icons/ai";
import style from "./PinIcon.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";
import { colours } from "@/app/styles/colours";

type PinIconTypes = {
    favourited: boolean;
    userId: string;
    setId: string;
    revalidate?: boolean;
};

const PinIcon = ({
    favourited,
    userId,
    setId,
    revalidate = true,
}: PinIconTypes) => {
    const handler = async () => {
        const favouriteDb = await addRemoveFavourites({
            id: userId,
            setId: setId,
            revalidate: false,
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
