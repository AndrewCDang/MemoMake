import React, { MutableRefObject, useEffect, useRef } from "react";
import { ColumnName, Refs, InputValues } from "../cardTableTypes";
import { UpdateCardTypes } from "@/app/_actions/updateCard";
import style from "../cardsTable.module.scss";
import { Flashcard_item } from "@/app/_types/types";
import PopToggler from "./popToggler";
import { HiOutlineX } from "react-icons/hi";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type GenericField = {
    item: ColumnName;
    tableItemRef: MutableRefObject<Refs<HTMLElement>>;
    card: Flashcard_item;
    itemEditRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement>
    >;
    inputValues: InputValues;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        itemKey: string
    ) => void;
    labelEditEnterHandler: (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: ColumnName,
        id: string
    ) => void;
    updateCardHandler: ({ id, object, value }: UpdateCardTypes) => void;
    labelItemEditHandler: (key: string) => void;
    itemLabelRef: MutableRefObject<Refs<HTMLInputElement>>;
    handleValueChange: (value: string | string[], itemKey: string) => void;
    editInputRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement>
    >;
};

const TagsTableItem = ({
    item,
    tableItemRef,
    card,
    itemEditRef,
    inputValues,
    handleInputChange,
    labelEditEnterHandler,
    updateCardHandler,
    // Invisible Input PopOver Toggler
    labelItemEditHandler,
    itemLabelRef,
    handleValueChange,
    editInputRef,
}: GenericField) => {
    const [parent] = useAutoAnimate();
    const [parentLabel] = useAutoAnimate();

    const displayValue =
        (inputValues[`${item}~${card.id}`] as string[]) ??
        (item !== "last_modified" ? card[item] : "");

    const removeFromCategory = (tag: string) => {
        const remainingTags = (displayValue as string[]).filter(
            (item) => item !== tag
        );
        setTimeout(() => {
            handleValueChange(remainingTags, `${item}~${card.id}`);
        }, 0);
    };

    const inputTagRef = useRef<HTMLInputElement>(null);

    const addToCategory = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.target) return null;
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();
        if (value === "") return null;

        if (!displayValue.includes(value)) {
            const newArray = [...displayValue, value];
            setTimeout(() => {
                handleValueChange(newArray, `${item}~${card.id}`);
            }, 0);
            target.value = "";
        }
    };
    const enterToCategory = (e: KeyboardEvent) => {
        if (!e.target) return null;
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();
        console.log(value.length);

        const newArray = [...displayValue, value];

        if (e.key === "Enter" || (value !== "" && e.key === " ")) {
            e.preventDefault();
            if (!displayValue.includes(value)) {
                setTimeout(() => {
                    handleValueChange(newArray, `${item}~${card.id}`);
                }, 0);
            }
            target.value = "";
        }
    };

    useEffect(() => {
        if (
            editInputRef.current &&
            editInputRef.current[`${item}~${card.id}`]
        ) {
            (
                editInputRef.current[`${item}~${card.id}`] as HTMLInputElement
            ).addEventListener("keydown", enterToCategory);
            return () => {
                if (
                    editInputRef.current &&
                    editInputRef.current[`${item}~${card.id}`]
                ) {
                    (
                        editInputRef.current[
                            `${item}~${card.id}`
                        ] as HTMLInputElement
                    ).removeEventListener("keydown", enterToCategory);
                }
            };
        }
    }, [editInputRef, inputValues]);

    return (
        <>
            {/* Table item - Special Output - Tags */}
            <div
                ref={(el) => {
                    tableItemRef.current[`${item}~${card.id}`] = el;
                }}
            >
                <div ref={parentLabel} className={style.tagContainer}>
                    {displayValue.map((tag, index) => {
                        return (
                            <div
                                className={style.itemTag}
                                key={`${item}-${card.id}-tag-${index}`}
                            >
                                {tag}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Invisible Input */}
            <PopToggler
                labelItemEditHandler={labelItemEditHandler}
                itemLabelRef={itemLabelRef}
                item={item}
                card={card}
            />

            {/* Popover for tag/array items */}
            <div
                className={`${style.itemInputEdit} ${style.popoverTagContainer}`}
                ref={(el) => {
                    itemEditRef.current[`${item}~${card.id}`] = el;
                }}
            >
                <section ref={parent}>
                    {displayValue.map((tag, index) => {
                        return (
                            <div key={`${item}-${card.id}-popItem-${tag}`}>
                                {tag}
                                <div onClick={() => removeFromCategory(tag)}>
                                    <HiOutlineX />
                                </div>
                            </div>
                        );
                    })}
                </section>
                <div className={style.tagInput}>
                    <input
                        ref={(el) =>
                            (editInputRef.current[`${item}~${card.id}`] = el)
                        }
                        type="text"
                        id={`${item}-${card.id}-edit`}
                        onBlur={(e) => addToCategory(e)}
                    ></input>
                </div>
            </div>
        </>
    );
};

export default TagsTableItem;
