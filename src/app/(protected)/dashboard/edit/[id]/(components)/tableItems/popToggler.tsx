import React from "react";
import { MutableRefObject } from "react";
import style from "../../cardsTable.module.scss";
import {
    ColumnName,
    ColsWidthType,
    Refs,
    InputValues,
} from "../../cardTableTypes";
import { Flashcard_item } from "@/app/_types/types";

type PopTogglerTypes = {
    item: ColumnName;
    card: Flashcard_item;
    labelItemEditHandler: (key: string) => void;
    itemLabelRef: MutableRefObject<Refs<HTMLInputElement>>;
};

function PopToggler({
    item,
    card,
    labelItemEditHandler,
    itemLabelRef,
}: PopTogglerTypes) {
    return (
        <input
            id={`${item}-${card.id}-input`}
            className={style.itemInput}
            type="checkbox"
            onChange={() => labelItemEditHandler(`${item}~${card.id}`)}
            ref={(el) => {
                itemLabelRef.current[`${item}~${card.id}`] = el;
            }}
        ></input>
    );
}

export default PopToggler;
