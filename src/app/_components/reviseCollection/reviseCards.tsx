"use client";

import React, { useEffect, useState } from "react";
import Button from "../(buttons)/styledButton";
import Modal from "../modal/modal";
import ReviseCollectionModalContent from "./reviseModalContent";
import {
    Flashcard_set_with_count,
    Flashcard_set,
    Flashcard_item,
} from "@/app/_types/types";
import { tagsCollectionTypes } from "@/app/_lib/fetch/fetchTagsInCollection";
import { Session } from "next-auth";

type ReviseCardsTypes = {
    initialSet: Flashcard_set | undefined;
    initialItems: Flashcard_item[];
    collectionSet: Flashcard_set_with_count[];
    tagsCollection: tagsCollectionTypes[];
    session: Session;
};

function ReviseCards({
    initialSet,
    initialItems,
    collectionSet,
    tagsCollection,
    session,
}: ReviseCardsTypes) {
    const [modalOn, setModalOn] = useState(false);

    const modalHandler = () => {
        setModalOn(true);
    };

    useEffect(() => {
        console.log(tagsCollection);
    }, [tagsCollection]);

    return (
        <div>
            <Button handler={modalHandler} text="Revise Set" />
            <Modal
                modalOn={modalOn}
                setModal={setModalOn}
                modalTitle={"Revise"}
            >
                <ReviseCollectionModalContent
                    collectionSet={collectionSet}
                    contentType="set"
                    session={session}
                />
            </Modal>
        </div>
    );
}

export default ReviseCards;
