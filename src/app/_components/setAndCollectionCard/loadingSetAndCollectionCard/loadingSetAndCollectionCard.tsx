import React from "react";
import style from "../setAndColelctionCard.module.scss";
import { ContentType } from "@/app/_types/types";
import BannerStrip from "../generalComponents/bannerStrip/bannerStrip";
import LoadingBannerStrip from "../generalComponents/bannerStrip/LoadingBannerStrip";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function LoadingSetAndCollectionCard({
    contentType,
}: {
    contentType: ContentType;
}) {
    return (
        <article className={style.setContainer}>
            <LoadingBannerStrip contentType={contentType} />

            <section
                style={{
                    top: contentType === "set" ? "1.25rem" : "0.5rem",
                }}
                className={style.bannerBtns}
            >
                {/* <BannerBtns
                    publicCard={publicCard}
                    contentType={contentType}
                    setIsFavourited={setIsFavourited}
                    setIsLiked={setIsliked}
                    isLiked={isLiked}
                    isFavourited={isFavourited}
                    account={account}
                    set={set}
                /> */}
            </section>
            {/* <TitleAndBody /> */}
            {/* Displaying Set items in collection card only */}
            {/* {contentType === "collection" && (
                <CollectionSets
                    collectionItem={set as Flashcard_collection_set_joined}
                />
            )} */}
            <div className={style.buttonContainerHeight}></div>
            {/* <PreviewEditStudyBtns
                publicCard={publicCard}
                contentType={contentType}
                set={set}
            /> */}
            <Skeleton />
        </article>
    );
}

export default LoadingSetAndCollectionCard;
