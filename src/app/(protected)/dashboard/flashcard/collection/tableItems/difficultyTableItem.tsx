import React, { MutableRefObject } from "react";
import { ColumnName, Refs, InputValues } from "../cardTableTypes";
import style from "../cardsTable.module.scss";
import { Flashcard_item } from "@/app/_types/types";
import PopToggler from "./popToggler";
import { colours } from "@/app/styles/colours";
import { HiOutlineX } from "react-icons/hi";
import { motion } from "framer-motion";

type GenericField = {
    item: ColumnName;
    tableItemRef: MutableRefObject<Refs<HTMLElement>>;
    card: Flashcard_item;
    itemEditRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement>
    >;
    inputValues: InputValues;
    labelItemEditHandler: (key: string) => void;
    itemLabelRef: MutableRefObject<Refs<HTMLInputElement>>;
    handleValueChange: (value: string, itemKey: string) => void;
};

export const diffArray = ["EASY", "MEDIUM", "HARD"];

export const labelColour = (diff: string) => {
    switch (diff) {
        case "NA":
            return "";
        case "EASY":
            return colours.green();
        case "MEDIUM":
            return colours.yellow();
        case "HARD":
            return colours.red();
        default:
    }
};

function DifficultyTableItem({
    item,
    tableItemRef,
    card,
    itemEditRef,
    inputValues,
    // Invisible Input PopOver Toggler
    labelItemEditHandler,
    itemLabelRef,
    //
    handleValueChange,
}: GenericField) {
    const displayValue =
        inputValues[`${item}~${card.id}`] ??
        (item !== "item_tags" && item !== "last_modified" ? card[item] : "");

    return (
        <>
            {/* Label Value  */}
            <div
                className={`${style.difficultyLabelValue} ${style.difficultyLabelItem}  ${style.tableItem}`}
                ref={(el) => {
                    tableItemRef.current[`${item}~${card.id}`] = el;
                }}
                style={{ backgroundColor: labelColour(displayValue as string) }}
            >
                {displayValue !== "NA" && (displayValue as string)}
            </div>
            {/* Invisible Input */}
            <PopToggler
                labelItemEditHandler={labelItemEditHandler}
                itemLabelRef={itemLabelRef}
                item={item}
                card={card}
            />
            {/* PopOver */}
            <div
                className={`${style.itemInputEdit} ${style.difficultyPopContainer}`}
                ref={(el) => {
                    itemEditRef.current[`${item}~${card.id}`] = el;
                }}
            >
                {displayValue !== "NA" && (
                    <div>
                        <div
                            className={style.difficultyLabelValue}
                            style={{
                                backgroundColor: labelColour(
                                    displayValue as string
                                ),
                            }}
                        >
                            {displayValue as string}
                            <div
                                onClick={() =>
                                    setTimeout(() => {
                                        handleValueChange(
                                            "NA",
                                            `${item}~${card.id}`
                                        );
                                    }, 0)
                                }
                            >
                                <HiOutlineX />
                            </div>
                        </div>
                    </div>
                )}

                <form className={style.otherDiffSelection}>
                    {diffArray.map((diff, index) => {
                        if (diff === displayValue) {
                            return null;
                        }

                        return (
                            <motion.fieldset
                                key={`${item}-${card.id}-popRadio-${diff}`}
                                layout="position"
                            >
                                <label
                                    style={{
                                        backgroundColor: labelColour(diff),
                                    }}
                                    className={style.difficultyLabelValue}
                                    onClick={() =>
                                        setTimeout(() => {
                                            handleValueChange(
                                                diff,
                                                `${item}~${card.id}`
                                            );
                                        }, 0)
                                    }
                                >
                                    {diff}
                                </label>
                            </motion.fieldset>
                        );
                    })}
                </form>
            </div>
        </>
    );
}

export default DifficultyTableItem;
