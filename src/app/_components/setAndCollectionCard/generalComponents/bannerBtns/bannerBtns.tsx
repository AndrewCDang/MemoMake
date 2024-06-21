"use client";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import style from "./bannerBtns.module.scss";
import { HiMiniTrash } from "react-icons/hi2";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Account, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { colours } from "@/app/styles/colours";

type BannerBtnsTypes = {
    setIsFavourited: Dispatch<SetStateAction<boolean>>;
    isFavourited: boolean;
    account: Account;
    set: Flashcard_collection_set_joined | Flashcard_set;
};

const BannerIcon = ({
    children,
    handler,
}: {
    children: ReactNode;
    handler: () => void;
}) => {
    return (
        <button onClick={handler} className={style.bannerIcon}>
            {children}
        </button>
    );
};
function BannerBtns({
    setIsFavourited,
    isFavourited,
    set,
    account,
}: BannerBtnsTypes) {
    return (
        <div className={style.bannerBtnsContainer}>
            <BannerIcon
                handler={() => setIsFavourited((prevState) => !prevState)}
            >
                <PinIcon
                    favourited={isFavourited}
                    userId={account && account.user_id}
                    setId={set.id}
                />
            </BannerIcon>
            <BannerIcon handler={() => null}>
                <HiMiniTrash style={{ fill: colours.black(0.4) }} />
            </BannerIcon>
        </div>
    );
}

export default BannerBtns;
