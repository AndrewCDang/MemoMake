"use client";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import {
    ContentType,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import React from "react";
import { HiArrowSmallRight } from "react-icons/hi2";

function StudyBtn({
    set,
    contentType,
}: {
    set: Flashcard_set | Flashcard_collection_set_joined;
    contentType: ContentType;
}) {
    // Study Handler | Modal
    const { setInitialCollectionItems, setInitalSet, showReviseModal } =
        useReviseModal();

    const studyHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { id: id, type: contentType },
        });

        if (!promise) return;
        if (contentType === "set") {
            setInitalSet({ item: promise as Flashcard_set_with_cards[] });
        } else if (contentType === "collection") {
            setInitialCollectionItems({
                item: promise as Flashcard_collection_preview,
            });
        }

        showReviseModal();
    };
    return (
        <DefaultButton variant="Black" handler={() => studyHandler(set.id)}>
            <span>Study</span>
            <HiArrowSmallRight />
        </DefaultButton>
    );
}

export default StudyBtn;
