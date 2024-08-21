"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./sectionTemplate.module.scss";
import { ContentType } from "@/app/_types/types";
import LoadingSetAndCollectionCard from "../setAndCollectionCard/loadingSetAndCollectionCard/loadingSetAndCollectionCard";

type SetCollectionContainerType = {
    contentType: ContentType;
    numItems: number;
};

const getGridColumns = (containerWidth: number) => {
    const gridGap = 16;
    const minGridWidth = 240;

    return Math.floor((containerWidth + gridGap) / (gridGap + minGridWidth));
};

/**
 *
 *  Loading version of set/collection container items
 * @returns React.Node
 */
function LoadingSetCollectionContainer({
    contentType,
    numItems,
}: SetCollectionContainerType) {
    const gridRef = useRef<HTMLElement>(null);
    const [gridColumns, setGridColumns] = useState<number>(1);
    const [trailingItems, setTrailingItems] = useState<number>(0);

    const gettrailingItems = useCallback(() => {
        if (gridRef.current) {
            const gridCols = getGridColumns(gridRef.current.offsetWidth);
            setGridColumns(gridCols);
            setTrailingItems(numItems % gridCols);
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
        if (typeof window !== "undefined") {
            window.addEventListener("resize", gettrailingItemsHandler);
            return () =>
                window.removeEventListener("resize", gettrailingItemsHandler);
        }
    }, []);

    return (
        <section ref={gridRef} className={style.setGrid}>
            {numItems &&
                Array(numItems)
                    .fill(0)
                    .map((item, index) => {
                        if (
                            numItems - index > trailingItems ||
                            trailingItems > 3 ||
                            index + 1 < gridColumns
                        )
                            return (
                                <LoadingSetAndCollectionCard
                                    key={index}
                                    contentType={contentType}
                                />
                            );
                    })}
        </section>
    );
}

export default LoadingSetCollectionContainer;
