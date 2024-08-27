"use client";
import { HiHeart } from "react-icons/hi2";
import style from "./favouriteIcon.module.scss";
import { useState } from "react";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";
import { ContentType } from "@/app/_types/types";

type FavouriteIconTypes = {
    favourited: boolean;
    userId: string;
    setId: string;
    contentType: ContentType;
};

const FavouriteIcon = ({
    favourited = false,
    userId,
    setId,
    contentType,
}: FavouriteIconTypes) => {
    const [favouriteState, setFavouriteState] = useState(favourited);

    const handler = async () => {
        setFavouriteState((prevState) => {
            return !prevState;
        });
        const favouriteDb = await addRemoveFavourites({
            contentType: contentType,
            id: userId,
            setId: setId,
        });
    };
    return (
        <button
            onClick={() => handler()}
            className={`${style.favouriteIcon} ${
                favouriteState ? style.favourited : style.notFavourited
            }`}
        >
            <HiHeart />
        </button>
    );
};

export default FavouriteIcon;
