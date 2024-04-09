import React from "react";
import { ColumnName } from "./cardTableTypes";
import { Flashcard_item } from "@/app/_types/types";
import style from "./cardsTable.module.scss";

type GenericField = {
    item: ColumnName;
    card: Flashcard_item;
};

function LastModifiedTableItem({ item, card }: GenericField) {
    const date = card.last_modified;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear(); // Get full year

    const formattedDate = `${day}/${month}/${year}`;
    return (
        <>
            {/* Table item - LastModifed */}
            <div className={style.lastModifedValue} key={`${item}-${card.id}`}>
                {formattedDate}
            </div>
        </>
    );
}

export default LastModifiedTableItem;
