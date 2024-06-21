"use client";
import { AiFillPushpin } from "react-icons/ai";
import style from "./PinIcon.module.scss";
import { useState } from "react";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";
import { colours } from "@/app/styles/colours";

type PinIconTypes = {
    favourited: boolean;
    userId: string;
    setId: string;
};

const PinIcon = ({ favourited = false, userId, setId }: PinIconTypes) => {
    const [pinIcon, setpinIcon] = useState(favourited);

    const handler = async () => {
        setpinIcon((prevState) => {
            return !prevState;
        });
        const favouriteDb = await addRemoveFavourites({
            id: userId,
            setId: setId,
            revalidate: true,
        });
    };
    return (
        <div
            onClick={() => handler()}
            className={`${style.pinIcon} ${
                pinIcon ? style.pinned : style.notPinned
            }`}
        >
            <AiFillPushpin
                style={{ fill: pinIcon ? colours.black() : colours.black(0.4) }}
            />
        </div>
    );
};

export default PinIcon;
