"use client";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import style from "./bannerBtns.module.scss";
import { HiMiniMagnifyingGlass, HiMiniTrash } from "react-icons/hi2";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Account, ContentType, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { colours } from "@/app/styles/colours";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import DeleteConfirmation from "./deleteConfirmation/deleteConfirmation";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import LikeIcon from "@/app/_components/_generalUi/likeIcon/likeIcon";

type BannerBtnsTypes = {
    publicCard: boolean;
    setIsFavourited: Dispatch<SetStateAction<boolean>>;
    isFavourited: boolean;
    setIsLiked: Dispatch<SetStateAction<boolean>>;
    isLiked: boolean;
    account: Account | undefined;
    set: Flashcard_collection_set_joined | Flashcard_set;
    contentType: ContentType;
    setIsDeleting: Dispatch<SetStateAction<boolean>>;
    setInitialContent: Dispatch<
        SetStateAction<Flashcard_collection_set_joined[] | Flashcard_set[]>
    >;
};

export const BannerIcon = ({
    hoverText,
    children,
    handler,
    hoverPos = "top",
}: {
    hoverText: string;
    children: ReactNode;
    handler: () => void;
    hoverPos?: "top" | "left" | "right";
}) => {
    return (
        <button onClick={handler} className={style.bannerIcon}>
            {children}
            <span
                className={
                    hoverPos === "top"
                        ? style.hoverLabel
                        : hoverPos === "right"
                        ? style.hoverLabelRight
                        : hoverPos === "left"
                        ? style.hoverLabelLeft
                        : ""
                }
            >
                {hoverText}
            </span>
        </button>
    );
};
function BannerBtns({
    setInitialContent,
    setIsDeleting,
    publicCard,
    setIsFavourited,
    isFavourited,
    setIsLiked,
    isLiked,
    set,
    account,
    contentType,
}: BannerBtnsTypes) {
    // Preview Handler | Modal
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const previewHandler = async (id: string) => {
        showUsePreviewModal();
        const promise = await fetchSetsWithItems({
            fetchObject: {
                userId: (account && account.user_id) || "",
                id: id,
                type: contentType,
            },
        });
        if (!promise) return;
        setPreviewCollectionItems({
            type: contentType,
            content: promise,
        });
    };

    const cardType = contentType[0].toUpperCase() + contentType.slice(1);

    // DelBtn Toggler
    const [delConfirmation, setDelConfirmation] = useState<boolean>(false);

    return (
        <div className={style.bannerBtnsContainer}>
            {/* Always available */}
            {account && (
                <BannerIcon
                    hoverText={`${isFavourited ? "Unpin" : "Pin"} ${cardType}`}
                    handler={() => setIsFavourited((prevState) => !prevState)}
                >
                    <PinIcon
                        contentType={contentType}
                        favourited={isFavourited}
                        userId={account && account.user_id}
                        setId={set.id}
                        revalidate={false}
                    />
                </BannerIcon>
            )}
            {/* Only available if card/collection is set to publically available */}
            {account &&
                set &&
                set.public_access &&
                account.user_id !== set.user_id && (
                    <BannerIcon
                        hoverText={
                            isLiked ? `Unlike ${cardType}` : `Like ${cardType}`
                        }
                        handler={() => setIsLiked((prevState) => !prevState)}
                    >
                        <LikeIcon
                            contentType={contentType}
                            isLiked={isLiked}
                            userId={account && account.user_id}
                            setId={set.id}
                        />
                    </BannerIcon>
                )}
            {/* If Card Belongs to user */}
            {account && account.user_id === set.user_id && (
                <div className={style.delBannerContainer}>
                    <BannerIcon
                        hoverText={`Delete ${cardType}`}
                        handler={() => setDelConfirmation(true)}
                    >
                        <HiMiniTrash style={{ fill: colours.black(0.4) }} />
                    </BannerIcon>
                    <PopOverContent
                        setIsOn={setDelConfirmation}
                        isOn={delConfirmation}
                    >
                        <DeleteConfirmation
                            setInitialContent={setInitialContent}
                            setIsDeleting={setIsDeleting}
                            account={account}
                            isOn={delConfirmation}
                            setIsOn={setDelConfirmation}
                            contentType={contentType}
                            id={set.id}
                            imageId={set.image_id}
                        />
                    </PopOverContent>
                </div>
            )}
            <BannerIcon
                hoverText={`Preview ${cardType}`}
                handler={() => previewHandler(set.id)}
            >
                <HiMiniMagnifyingGlass style={{ fill: colours.black(0.4) }} />
            </BannerIcon>
        </div>
    );
}

export default BannerBtns;
