"use client";
import { ContentType } from "@/app/_types/types";
import React from "react";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { CollectionIcon, SetIcon } from "../svgs/svgs";
import style from "./sectionTemplate.module.scss";
import LoadingSetAndCollectionCard from "../setAndCollectionCard/loadingSetAndCollectionCard/loadingSetAndCollectionCard";
import Skeleton from "react-loading-skeleton";
import gridStyle from "../setCollectionContentSection/sectionTemplate.module.scss";
import LoadingSetCollectionContainer from "./loadingSetGrid";

// Section Template
type SectionTemplateTypes = {
    title?: string;
    createBtn?: boolean;
    contentType: ContentType;
    totalPaginationItems?: number | null;
    totalItemsPerPage?: number;
};

/**
 * Container template holding flashcard sets/collections with optional filter/create btns
 * @param contentType set 'contentType'
 * @returns
 */

export const LoadingSectionTemplate = ({
    title,
    contentType,
    createBtn,
}: SectionTemplateTypes) => {
    return (
        <section className={style.sectionContainer}>
            <div className={style.sectionTitle}>
                <div className={style.iconAndTitle}>
                    {contentType === "collection" ? (
                        <CollectionIcon />
                    ) : contentType === "set" ? (
                        <SetIcon />
                    ) : null}
                    <h6>{title || capitaliseFirstChar(contentType)}</h6>
                </div>
                {createBtn && (
                    <div className={style.loadingSectionBtnGroup}>
                        <Skeleton height={"100%"} width={"100%"} />
                    </div>
                )}
            </div>
            <LoadingSetCollectionContainer
                contentType={contentType}
                numItems={6}
            />
        </section>
    );
};
export default LoadingSectionTemplate;
