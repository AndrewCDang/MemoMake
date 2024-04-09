import { Dispatch, SetStateAction } from "react";
import { ColumnName } from "./cardTableTypes";
import style from "./cardsTable.module.scss";
import CornerClose from "@/app/_components/cornerClose/cornerClose";
import { HiOutlineX } from "react-icons/hi";

type AppliedFiltersTypes = {
    filteredTags: string[];
    setFilteredTags: Dispatch<SetStateAction<string[]>>;
    filteredDiff: string[];
    setFilteredDiff: Dispatch<SetStateAction<string[]>>;
    setHiddenColumns: Dispatch<SetStateAction<ColumnName[]>>;
    hiddenColumns: ColumnName[];
    setColumns: Dispatch<SetStateAction<ColumnName[]>>;
};

type FilterOptions = "difficulty" | "item_tags" | "hiddenCol";

type AppliedFilterBtnTypes = {
    item: string;
    object: FilterOptions;
};

export default function ApppliedFilters({
    filteredDiff,
    setFilteredDiff,
    filteredTags,
    setFilteredTags,
    hiddenColumns,
    setColumns,
    setHiddenColumns,
}: AppliedFiltersTypes) {
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
                } else {
                    setFilteredDiff((prevDiff) => {
                        return [...prevDiff, item];
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
                } else {
                    setFilteredTags((prevTags) => {
                        return [...prevTags, item];
                    });
                }
                break;
            case "hiddenCol":
                if (hiddenColumns.includes(item as ColumnName)) {
                    setHiddenColumns((prevCols) => {
                        const removedArray = prevCols.filter(
                            (col) => col !== item
                        );
                        setColumns(removedArray);
                        return removedArray;
                    });
                } else {
                    setHiddenColumns((prevState) => {
                        setColumns([...prevState, item as ColumnName]);
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

    return (
        <section className={style.appliedFiltersContainer}>
            {filteredDiff.length > 0 &&
                filteredDiff.map((item) => {
                    return (
                        <AppliedFilterBtn item={item} object={"difficulty"} />
                    );
                })}
            {filteredTags.length > 0 &&
                filteredTags.map((item) => {
                    return (
                        <AppliedFilterBtn item={item} object={"item_tags"} />
                    );
                })}
            {hiddenColumns.length > 0 &&
                hiddenColumns.map((item) => {
                    return (
                        <AppliedFilterBtn item={item} object={"hiddenCol"} />
                    );
                })}
        </section>
    );
}
