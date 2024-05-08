"use client";
import { HiHeart } from "react-icons/hi2";
import style from "./favouriteIcon.module.scss";
import { useState } from "react";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";

type FavouriteIconTypes = {
    favourited: boolean;
    userId: string;
    setId: string;
};

const FavouriteIcon = ({
    favourited = false,
    userId,
    setId,
}: FavouriteIconTypes) => {
    const [favouriteState, setFavouriteState] = useState(favourited);

    const handler = async () => {
        setFavouriteState((prevState) => {
            return !prevState;
        });
        const favouriteDb = await addRemoveFavourites({
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
