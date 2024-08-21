import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import style from "./cardsTable.module.scss";
import { ColumnName, Refs } from "./cardTableTypes";
import { HiEyeSlash } from "react-icons/hi2";
import { ImFilter } from "react-icons/im";
import { HiMiniXMark } from "react-icons/hi2";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { labelColour } from "@/app/_components/_generalUi/difficultyColours/difficultyColours";
import { diffArray } from "./tableItems/difficultyTableItem";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type TableRowFilterTypes = {
    filterContainerRefs: MutableRefObject<Refs<HTMLElement>>;
    object: ColumnName;
    setObjPopOver: Dispatch<SetStateAction<ColumnName | null>>;
    setColumns: Dispatch<SetStateAction<ColumnName[]>>;
    columns: ColumnName[];
    tagArray: string[];
    filteredTags: string[];
    setFilteredTags: Dispatch<SetStateAction<string[]>>;
    selectableTagsArray: string[] | null;
    setSelectableTagsArray: Dispatch<SetStateAction<string[] | null>>;
    filteredDiff: string[];
    setFilteredDiff: Dispatch<SetStateAction<string[]>>;
    setHiddenColumns: Dispatch<SetStateAction<ColumnName[]>>;
    hiddenColumns: ColumnName[];
};

function TableRowFilter({
    filterContainerRefs,
    object,
    setObjPopOver,
    setColumns,
    columns,
    tagArray,
    filteredTags,
    setFilteredTags,
    selectableTagsArray,
    setSelectableTagsArray,
    filteredDiff,
    setFilteredDiff,
    setHiddenColumns,
    hiddenColumns,
}: TableRowFilterTypes) {
    const [parent] = useAutoAnimate();

    // Controls secondary PopOver
    const [secondaryPopOver, setSecondaryPopOver] = useState<boolean>(false);

    const hideColumn = () => {
        const remainingColumns = columns.filter((col) => col !== object);
        setColumns(remainingColumns);

        setHiddenColumns((prevHidden) => {
            if (!prevHidden.includes(object)) {
                return [...prevHidden, object];
            } else {
                const remainingHidden = prevHidden.filter(
                    (col) => col !== object
                );
                return remainingHidden;
            }
        });
    };

    const showSecondaryPopup = () => {
        setTimeout(() => {
            setSecondaryPopOver(true);
        }, 0);
    };
    const hideSecondaryPopup = () => {
        setTimeout(() => {
            setSecondaryPopOver(false);
        }, 0);
    };

    // Filter Tags
    const filterTagsHandler = (tag: string) => {
        setTimeout(() => {
            setFilteredTags((prevTags) => {
                if (!prevTags.includes(tag)) {
                    return [...prevTags, tag];
                } else {
                    const remainingTags = prevTags.filter(
                        (item) => item !== tag
                    );
                    console.log(remainingTags);
                    return remainingTags;
                }
            });

            setSelectableTagsArray((prevTags) => {
                let array = prevTags as string[];
                if (prevTags === null) {
                    array = tagArray;
                }
                if (array.includes(tag)) {
                    const remainingTags = array.filter((item) => item !== tag);
                    return remainingTags;
                } else {
                    return [...array, tag];
                }
            });
        }, 0);
    };

    const selectableTags =
        selectableTagsArray ||
        tagArray.filter((tag) => !filteredTags.includes(tag));

    // Filter Difficulty

    const filterDifficultyHandler = (diff: string) => {
        setTimeout(() => {
            setFilteredDiff((prevDiff) => {
                if (!prevDiff.includes(diff)) {
                    return [...prevDiff, diff];
                } else {
                    const remainingTags = prevDiff.filter(
                        (item) => item !== diff
                    );
                    return remainingTags;
                }
            });
        }, 0);
    };

    const selectableFilter = diffArray.filter(
        (diff) => !filteredDiff.includes(diff)
    );

    //
    const filterableItems = ["item_tags", "difficulty"];

    return (
        <section
            ref={(el) => (filterContainerRefs.current[object] = el)}
            className={style.rowFilterContainer}
        >
            <AnimatePresence>
                {!secondaryPopOver ? (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -40,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{
                            duration: 0.12,
                            ease: "easeOut",
                        }}
                        className={style.rowFilterBtnWrap}
                    >
                        <div className={style.buttonContainer}>
                            <button onClick={() => hideColumn()}>
                                <HiEyeSlash />
                                <div>Hide Column</div>
                            </button>
                            {filterableItems.includes(object) && (
                                <button onClick={() => showSecondaryPopup()}>
                                    <ImFilter />
                                    <div>Filter</div>
                                    {object === "difficulty" &&
                                        filteredDiff.length > 0 && (
                                            <span className={style.filterCount}>
                                                {`${filteredDiff.length} item${
                                                    filteredDiff.length > 1
                                                        ? "s"
                                                        : ""
                                                }
                                                `}
                                            </span>
                                        )}
                                    {object === "item_tags" &&
                                        filteredTags.length > 0 && (
                                            <span className={style.filterCount}>
                                                {`${filteredTags.length} item${
                                                    filteredTags.length > 1
                                                        ? "s"
                                                        : ""
                                                }
                                                `}
                                            </span>
                                        )}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setObjPopOver(null)}
                            className={style.closeObjPop}
                        >
                            <HiMiniXMark />
                        </button>
                    </motion.div>
                ) : (
                    <motion.section
                        initial={{
                            opacity: 0,
                            y: -40,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{
                            duration: 0.12,
                            ease: "easeOut",
                        }}
                        className={style.filterPopOver}
                    >
                        <div
                            onClick={hideSecondaryPopup}
                            className={style.returnPopOver}
                        >
                            <HiArrowUturnLeft />
                        </div>
                        {object === "item_tags" && (
                            <>
                                <div>
                                    {filteredTags.length > 0 ? (
                                        <div
                                            className={style.selectedTagFilter}
                                        >
                                            {filteredTags.map((tag) => (
                                                <div
                                                    className={
                                                        style.selectedTagContainer
                                                    }
                                                    key={tag}
                                                >
                                                    <label
                                                        className={
                                                            style.filterTagItem
                                                        }
                                                    >
                                                        {tag}
                                                    </label>
                                                    <div
                                                        onClick={() =>
                                                            filterTagsHandler(
                                                                tag
                                                            )
                                                        }
                                                    >
                                                        <HiOutlineX />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span>
                                            No filters currently applied
                                        </span>
                                    )}
                                </div>
                                <div
                                    ref={parent}
                                    className={style.tagsContainer}
                                >
                                    {selectableTags.map((tag) => (
                                        <label
                                            onClick={(e) =>
                                                filterTagsHandler(tag)
                                            }
                                            className={style.filterTagItem}
                                            key={tag}
                                        >
                                            {tag}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                        {object === "difficulty" && (
                            <>
                                <div>
                                    {filteredDiff.length > 0 ? (
                                        <div
                                            className={style.selectedTagFilter}
                                        >
                                            {filteredDiff.map((diff) => (
                                                <div
                                                    className={
                                                        style.selectedTagContainer
                                                    }
                                                    key={diff}
                                                >
                                                    <label
                                                        className={
                                                            style.filterDiffItem
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                labelColour(
                                                                    diff
                                                                ),
                                                        }}
                                                    >
                                                        {diff}
                                                    </label>
                                                    <div
                                                        onClick={() =>
                                                            filterDifficultyHandler(
                                                                diff
                                                            )
                                                        }
                                                    >
                                                        <HiOutlineX />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span>
                                            No filters currently applied
                                        </span>
                                    )}
                                </div>
                                <form
                                    ref={parent}
                                    className={style.otherDiffSelection}
                                >
                                    {selectableFilter.map((diff, index) => {
                                        return (
                                            <fieldset key={diff}>
                                                <label
                                                    style={{
                                                        backgroundColor:
                                                            labelColour(diff),
                                                    }}
                                                    className={
                                                        style.difficultyLabelValue
                                                    }
                                                    onClick={() =>
                                                        setTimeout(() => {
                                                            filterDifficultyHandler(
                                                                diff
                                                            );
                                                        }, 0)
                                                    }
                                                >
                                                    {diff}
                                                </label>
                                            </fieldset>
                                        );
                                    })}
                                </form>
                            </>
                        )}
                    </motion.section>
                )}
            </AnimatePresence>
        </section>
    );
}

export default TableRowFilter;
