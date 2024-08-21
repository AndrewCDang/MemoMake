"use client";
import React, { useEffect, useState } from "react";
import EditHeading from "./heading/editHeading";
import CardsTable from "./(components)/cardsTable";
import TablePageBtns from "../(components)/TablePageBtns/tablePageBtns";
import { Flashcard_item, Flashcard_set_with_cards } from "@/app/_types/types";
import { Session } from "next-auth";
import style from "./(components)/cardsTable.module.scss";
import LoadingCircle from "@/app/_components/loadingUi/loadingCircle";

type EditPageTypes = {
    initialSet: Flashcard_set_with_cards;
    cardCollection: Flashcard_item[];
    tagArray: any[];
    session: Session;
};

function EditPageContent({
    initialSet,
    cardCollection,
    tagArray,
    session,
}: EditPageTypes) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted) {
        console.log(tagArray);
        console.log(cardCollection);
        return (
            <div className={style.overflowWrapper}>
                <CardsTable
                    cardCollection={cardCollection}
                    tagArray={tagArray}
                />
            </div>
        );
    }
    return (
        <div className={style.loadingWrapper}>
            <LoadingCircle variant="contain" />
        </div>
    );
}

export default EditPageContent;
