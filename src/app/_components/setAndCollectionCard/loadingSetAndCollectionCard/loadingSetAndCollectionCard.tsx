"use client";
import React from "react";
import style from "../setAndColelctionCard.module.scss";
import { ContentType } from "@/app/_types/types";
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
            {contentType === "set" ? (
                <div className={style.loadingBody}>
                    <Skeleton count={2} inline={false} />
                </div>
            ) : contentType === "collection" ? (
                <div className={style.loadingCollectionBody}>
                    <Skeleton />
                    <Skeleton height={"3rem"} />
                    <Skeleton />
                </div>
            ) : null}
        </article>
    );
}

export default LoadingSetAndCollectionCard;
