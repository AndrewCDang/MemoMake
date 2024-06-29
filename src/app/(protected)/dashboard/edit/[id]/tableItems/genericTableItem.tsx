import React, { MutableRefObject } from "react";
import { ColumnName, Refs, InputValues } from "../cardTableTypes";
import { UpdateCardTypes } from "@/app/_actions/updateCard";
import style from "../cardsTable.module.scss";
import { Flashcard_item } from "@/app/_types/types";
import ReactTextareaAutosize from "react-textarea-autosize";
import PopToggler from "./popToggler";

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
    editInputRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement>
    >;
};

function GenericTableItem({
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
    editInputRef,
}: GenericField) {
    return (
        <>
            {/* Label Value  */}
            <div
                className={`${style.tableItem} ${style.tableWordBreak}`}
                ref={(el) => {
                    tableItemRef.current[`${item}~${card.id}`] = el;
                }}
            >
                {card[item] as string}
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
                className={style.itemInputEdit}
                ref={(el) => {
                    itemEditRef.current[`${item}~${card.id}`] = el;
                }}
            >
                <ReactTextareaAutosize
                    id={`${item}-${card.id}-edit`}
                    value={
                        inputValues[`${item}~${card.id}`] ??
                        (item !== "item_tags" && item !== "last_modified"
                            ? card[item]
                            : "")
                    }
                    ref={(el) =>
                        (editInputRef.current[`${item}~${card.id}`] = el)
                    }
                    onChange={(e) => handleInputChange(e, `${item}~${card.id}`)}
                    onKeyDown={(e) => labelEditEnterHandler(e, item, card.id)}
                    // onBlur={(e) =>
                    //     e.target.value &&
                    //     updateCardHandler({
                    //         id: card.id,
                    //         object: item,
                    //         value: e.target.value,
                    //     })
                    // }
                />
            </div>
        </>
    );
}

export default GenericTableItem;
