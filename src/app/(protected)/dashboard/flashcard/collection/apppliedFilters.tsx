import { Dispatch, SetStateAction, useCallback } from "react";
import { ColumnName } from "./cardTableTypes";
import style from "./cardsTable.module.scss";
import { HiOutlineX } from "react-icons/hi";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { object } from "zod";
import React from "react";

type AppliedFiltersTypes = {
    filteredTags: string[];
    setFilteredTags: Dispatch<SetStateAction<string[]>>;
    filteredDiff: string[];
    setFilteredDiff: Dispatch<SetStateAction<string[]>>;
    setHiddenColumns: Dispatch<SetStateAction<ColumnName[]>>;
    hiddenColumns: ColumnName[];
    setColumns: Dispatch<SetStateAction<ColumnName[]>>;
    setSelectableTagsArray: Dispatch<SetStateAction<string[] | null>>;
    tagArray: string[];
};

type FilterOptions = "difficulty" | "item_tags" | "hiddenCol";

type AppliedFilterBtnTypes = {
    item: string;
    object: FilterOptions;
};

function ApppliedFilters({
    filteredDiff,
    setFilteredDiff,
    filteredTags,
    setFilteredTags,
    hiddenColumns,
    setColumns,
    setHiddenColumns,
    setSelectableTagsArray,
    tagArray,
}: AppliedFiltersTypes) {
    const [parent] = useAutoAnimate();

    const removeAppliedFilter = ({ item, object }: AppliedFilterBtnTypes) => {
        switch (object) {
            case "difficulty":
                if (filteredDiff.includes(item)) {
                    setFilteredDiff((prevDiff) => {
                        const removedArray = prevDiff.filter(
                            (diff) => diff !== item
                        );
                        return removedArray;
                    });
                }
                break;
            case "item_tags":
                if (filteredTags.includes(item)) {
                    setFilteredTags((prevTags) => {
                        const removedArray = prevTags.filter(
                            (tag) => tag !== item
                        );
                        return removedArray;
                    });
                    setSelectableTagsArray((prevTags) => {
                        let array = prevTags as string[];
                        if (prevTags === null) {
                            array = tagArray;
                        }

                        return [...array, item];
                    });
                }
                break;
            case "hiddenCol":
                if (hiddenColumns.includes(item as ColumnName)) {
                    setHiddenColumns((prevCols) => {
                        const removedArray = prevCols.filter(
                            (col) => col !== item
                        );

                        return removedArray;
                    });
                    setColumns((prevState) => {
                        return [...prevState, item as ColumnName];
                    });
                }
                break;

            default:
                break;
        }
    };

    const AppliedFilterBtn = ({ item, object }: AppliedFilterBtnTypes) => {
        return (
            <div className={style.appliedBtnContainer}>
                <button key={item}>
                    <span>
                        {object === "hiddenCol" ? "Hidden:" : "Filtered:"}{" "}
                    </span>
                    {item}
                    <div
                        className={style.closeBtn}
                        onClick={() => removeAppliedFilter({ item, object })}
                    >
                        <HiOutlineX />
                    </div>{" "}
                </button>

                <div className={style.glowingBorder}></div>
            </div>
        );
    };

    const filterCallack = useCallback(() => {
        const diffArray = filteredDiff.map((item) => {
            return {
                item: item,
                object: "difficulty",
            };
        });

        const tagsArray = filteredTags.map((item) => {
            return {
                item: item,
                object: "item_tags",
            };
        });

        const hiddenArray = hiddenColumns.map((item) => {
            return {
                item: item,
                object: "hiddenCol",
            };
        });

        const filterCollection = [...diffArray, ...tagsArray, ...hiddenArray];

        return filterCollection;
    }, [hiddenColumns, filteredTags, filteredDiff]);

    return (
        <section ref={parent} className={style.appliedFiltersContainer}>
            {filterCallack().length > 0 &&
                filterCallack().map((item) => {
                    return (
                        <AppliedFilterBtn
                            key={`${item.object}-${item.item}`}
                            item={item.item}
                            object={item.object as FilterOptions}
                        />
                    );
                })}
        </section>
    );
}

export default React.memo(ApppliedFilters);
