"use client";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import style from "./bannerBtns.module.scss";
import { HiMiniMagnifyingGlass, HiMiniTrash } from "react-icons/hi2";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Account, ContentType, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { colours } from "@/app/styles/colours";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import DeleteConfirmation from "./deleteConfirmation/deleteConfirmation";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";

type BannerBtnsTypes = {
    publicCard: boolean;
    setIsFavourited: Dispatch<SetStateAction<boolean>>;
    isFavourited: boolean;
    account: Account | undefined;
    set: Flashcard_collection_set_joined | Flashcard_set;
    contentType: ContentType;
};

export const BannerIcon = ({
    hoverText,
    children,
    handler,
}: {
    hoverText: string;
    children: ReactNode;
    handler: () => void;
}) => {
    return (
        <button onClick={handler} className={style.bannerIcon}>
            {children}
            <span className={style.hoverLabel}>{hoverText}</span>
        </button>
    );
};
function BannerBtns({
    publicCard,
    setIsFavourited,
    isFavourited,
    set,
    account,
    contentType,
}: BannerBtnsTypes) {
    // Preview Handler | Modal
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const previewHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { id: id, type: contentType },
        });
        if (!promise) return;
        setPreviewCollectionItems({
            type: contentType,
            content: promise,
        });
        showUsePreviewModal();
    };

    const cardType = contentType[0].toUpperCase() + contentType.slice(1);

    // DelBtn Toggler
    const [delConfirmation, setDelConfirmation] = useState<boolean>(false);

    return (
        <div className={style.bannerBtnsContainer}>
            {account && (
                <BannerIcon
                    hoverText={`Pin ${cardType}`}
                    handler={() => setIsFavourited((prevState) => !prevState)}
                >
                    <PinIcon
                        favourited={isFavourited}
                        userId={account && account.user_id}
                        setId={set.id}
                    />
                </BannerIcon>
            )}
            {account && account.user_id === set.user_id && (
                <div className={style.delBannerContainer}>
                    <BannerIcon
                        hoverText={`Delete ${cardType}`}
                        handler={() => setDelConfirmation(true)}
                    >
                        <HiMiniTrash style={{ fill: colours.black(0.4) }} />
                    </BannerIcon>
                    <PopOverContent isOn={delConfirmation}>
                        <DeleteConfirmation
                            account={account}
                            isOn={delConfirmation}
                            setIsOn={setDelConfirmation}
                            contentType={contentType}
                            id={set.id}
                        />
                    </PopOverContent>
                </div>
            )}
            {!publicCard && (
                <BannerIcon
                    hoverText={`Preview ${cardType}`}
                    handler={() => previewHandler(set.id)}
                >
                    <HiMiniMagnifyingGlass
                        style={{ fill: colours.black(0.4) }}
                    />
                </BannerIcon>
            )}
        </div>
    );
}

export default BannerBtns;
