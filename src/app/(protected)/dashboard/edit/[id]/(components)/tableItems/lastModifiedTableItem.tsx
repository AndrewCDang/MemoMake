import React from "react";
import { ColumnName } from "../../cardTableTypes";
import { Flashcard_item } from "@/app/_types/types";
import style from "../../cardsTable.module.scss";
import { formatDate } from "@/app/_functions/formatDate";

type GenericField = {
    item: ColumnName;
    card: Flashcard_item;
};

function LastModifiedTableItem({ item, card }: GenericField) {
    const formattedDate = formatDate(card.last_modified);
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
