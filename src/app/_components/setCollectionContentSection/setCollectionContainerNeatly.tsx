"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./sectionTemplate.module.scss";
import SetAndCollectionCard from "../setAndCollectionCard/setAndCollectionCard";
import {
    AccountWithLikes,
    ContentType,
    Flashcard_set,
} from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";

type SetCollectionContainerType = {
    account: AccountWithLikes | undefined;
    content: Flashcard_collection_set_joined[] | Flashcard_set[];
    contentType: ContentType;
    dynamicNeat: boolean;
};

const getGridColumns = (containerWidth: number) => {
    const gridGap = 16;
    const minGridWidth = 240;

    return Math.floor((containerWidth + gridGap) / (gridGap + minGridWidth));
};

/**
 *
 *  Version removes trailing items from container, better visual clarity for public search pages
 * @returns React.Node
 */
function SetCollectionContainerNeatly({
    account,
    content,
    contentType,
    dynamicNeat = false,
}: SetCollectionContainerType) {
    const gridRef = useRef<HTMLElement>(null);
    const [gridColumns, setGridColumns] = useState<number>(1);
    const [trailingItems, setTrailingItems] = useState<number>(0);

    const gettrailingItems = useCallback(() => {
        if (gridRef.current) {
            const gridCols = getGridColumns(gridRef.current.offsetWidth);
            setGridColumns(gridCols);
            setTrailingItems(content.length % gridCols);
        }
    }, []);

    const gettrailingItemsHandler = useCallback(() => {
        gettrailingItems();
    }, []);

    useEffect(() => {
        if (gridRef.current) {
            gettrailingItemsHandler();
        }
    }, [gridRef]);

    useEffect(() => {
        window.addEventListener("resize", gettrailingItemsHandler);
        return () =>
            window.removeEventListener("resize", gettrailingItemsHandler);
    }, []);

    return (
        <section ref={gridRef} className={style.setGrid}>
            {content &&
                dynamicNeat &&
                content.map((item, index) => {
                    if (
                        content.length - index > trailingItems ||
                        trailingItems > 3 ||
                        index + 1 < gridColumns
                    )
                        return (
                            <SetAndCollectionCard
                                key={item.id}
                                set={item}
                                account={account}
                                contentType={contentType}
                            />
                        );
                })}
            {content &&
                !dynamicNeat &&
                content.map((item) => {
                    return (
                        <SetAndCollectionCard
                            key={item.id}
                            set={item}
                            account={account}
                            contentType={contentType}
                        />
                    );
                })}
            {content.length === 1 && gridColumns > 2 && <div></div>}
            {/* Fills grid from second row, so last row will not have trailing items */}
            {gridColumns - trailingItems < 3 &&
                content.length > gridColumns &&
                gridColumns > 2 &&
                Array(gridColumns - trailingItems)
                    .fill(0)
                    .map((item, index) => {
                        return <div key={`fillGrid-${index}`}>...</div>;
                    })}
        </section>
    );
}

export default SetCollectionContainerNeatly;
