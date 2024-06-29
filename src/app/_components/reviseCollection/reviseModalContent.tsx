"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import style from "./reviseCards.module.scss";
import Button from "../(buttons)/styledButton";
import {
    Flashcard_item,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import { useRouter } from "next/navigation";
import { useReviseModal } from "./useReviseModal";
import TagsModalSection from "./components/tagsModalSection";
import DifficultyModalSection from "./components/difficultyModalSection";
import AvailableQuestionSection from "./components/availableQuestionsSection";
import CollectionAndSetsSection from "./components/collectionAndSetsSection";
import { Session } from "next-auth";
import useRevisionFlashItems from "@/app/_hooks/useRevisionFlashItems";

type ReviseCollectionModalContentTypes = {
    session: Session;
    collectionSet?: Flashcard_set_with_count[];
    contentType: "collection" | "set";
};

export type diffOptions = "NA" | "EASY" | "MEDIUM" | "HARD";

function ReviseCollectionModalContent({
    session,
    // initialSet,
    // initialItems,
    collectionSet = [],
    contentType,
}: // tagsCollection,
ReviseCollectionModalContentTypes) {
    const {
        initialCollectionItems,
        initialSetItems,
        reviseModalType,
        hideReviseModal,
    } = useReviseModal();

    const router = useRouter();
    const [reviseAll, setReviseAll] = useState<boolean>(true);
    const [allTags, setAllTags] = useState<boolean>(true);
    const [allDiff, setAllDiff] = useState<boolean>(true);

    const getCollectionItems = (fetch: "flashcards" | "tags") => {
        if (initialCollectionItems.length > 0 || initialSetItems.length > 0) {
            const getCards = () => {
                if (reviseModalType === "collection") {
                    return initialCollectionItems
                        .flatMap((collection) =>
                            collection.sets.flatMap((set) => set.flashcards)
                        )
                        .filter((item) => item !== null);
                } else if (reviseModalType === "set") {
                    return initialSetItems.flatMap((item) => item.flashcards);
                }
                return [];
            };

            const array = getCards();

            switch (fetch) {
                case "flashcards":
                    return array as Flashcard_item[];
                case "tags":
                    const tags = Array.from(
                        new Set(
                            array
                                .filter((item) => {
                                    if (item) {
                                        return item;
                                    }
                                })
                                .flatMap((item) => item.item_tags)
                                .flat()
                        )
                    );
                    return tags as string[];
                default:
                    break;
            }
        }
        return [];
    };

    const [selectedSets, setSelectedSets] = useState<
        Flashcard_set_with_cards[]
    >(initialSetItems.length > 0 ? initialSetItems : []);

    // Available Tags via filtering through selecteditems
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tagsCollection = getCollectionItems("tags") as string[];

    const availableTags =
        tagsCollection &&
        tagsCollection

            .filter((item) => !selectedTags.includes(item))
            .sort((a: string, b: string) => {
                let lowerA = a.toLowerCase();
                let lowerB = b.toLowerCase();

                if (lowerA < lowerB) {
                    return -1;
                }
                if (lowerA > lowerB) {
                    return 1;
                }
                // When equal
                return 0;
            });

    const selectedTagListHandler = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((prevState) => {
                const previousArray = prevState.filter((prev) => prev !== tag);
                return previousArray;
            });
        } else {
            setSelectedTags((prevState) => {
                return [...prevState, tag];
            });
        }
    };

    // Available Difficulty Options
    const [selectedDiff, setSelectedDiff] = useState<diffOptions[]>([]);

    // Fetching flashcard items from selected sets

    const fetchedItems = [
        ...(getCollectionItems("flashcards") as Flashcard_item[]),
    ];

    const [fetchLoading, setFetchLoading] = useState<boolean>(false);

    // Filtering Fetched items By Tags and difficulties if applicable

    const filterByTags = allTags
        ? fetchedItems
        : fetchedItems.filter(
              (item) =>
                  item &&
                  item.item_tags.some((tagItem) =>
                      selectedTags.includes(tagItem)
                  )
          ); //Only includes items of matching selected tags

    const filterThenByDifficulties = allDiff
        ? filterByTags
        : filterByTags.filter(
              (item) => item && selectedDiff.includes(item.difficulty)
          ); //Only includes items of matching selected  diff tags

    const filteredFlashItems = filterThenByDifficulties.filter(
        (item, index, array) => {
            const idArray = array.map((item) => item.id);
            if (idArray.indexOf(item.id) === index) {
                return item;
            }
        }
    ); //Removes duplicates

    useEffect(() => {
        console.log(filterThenByDifficulties);
    }, [filterThenByDifficulties]);

    // Slider State Togglers

    const sliderTagsHandler = () => {
        setAllTags((prevState) => {
            return !prevState;
        });
    };

    const sliderDifficultyHandler = () => {
        setAllDiff((prevState) => {
            return !prevState;
        });
    };

    const sliderToggleHandler = () => {
        setReviseAll((prevState) => {
            return !prevState;
        });
    };

    // Setting Revision items providing validated conditions
    const {
        setCollectionItem,
        setQuestions,
        setIncorrectQuestions,
        incorrectQuestions,
        setStudyPage,
    } = useRevisionFlashItems();

    const startRevisionHandler = () => {
        if (filteredFlashItems.length > 0) {
            // Setting flashcard questions for study page
            setQuestions(filteredFlashItems);
            console.log(initialCollectionItems);
            // Setting titles/subtitles for collection/set
            if (incorrectQuestions.length > 0) setIncorrectQuestions([]);
            if (reviseModalType === "collection") {
                if (initialCollectionItems)
                    setCollectionItem(initialCollectionItems);
                setStudyPage({
                    studySubtitles: initialCollectionItems.flatMap((item) =>
                        item.sets.map((setItem) => setItem.set_name)
                    ),
                    studyTitles: initialCollectionItems.flatMap(
                        (item) => item.collection_name
                    ),
                    studyType: "collection",
                });
            } else if (reviseModalType === "set") {
                setStudyPage({
                    studySubtitles: selectedSets.flatMap(
                        (setItem) => setItem.set_categories
                    ),
                    studyTitles: selectedSets.map(
                        (setItem) => setItem.set_name
                    ),
                    studyType: "set",
                });
            }

            // setting url params before pushing to study page. Data saved in state, for refresh/non-saved state, data is fetched using params
            const collection =
                initialCollectionItems.length > 0
                    ? `collection=${initialCollectionItems
                          .map((item) => item.id)
                          .join("_")}`
                    : "";
            const set =
                initialSetItems.length > 0
                    ? `&set=${initialSetItems.map((item) => item.id).join("_")}`
                    : "";
            const tags =
                selectedTags.length > 0
                    ? `&tags=${selectedTags.join("_")}`
                    : "";
            const difficulties =
                selectedDiff.length > 0
                    ? `&difficulties=${selectedDiff.join("_")}`
                    : "";

            const url = `/study?${collection}${set}${tags}${difficulties}`;
            hideReviseModal();
            router.push(url);
        }
    };

    return (
        <section className={style.cardModal}>
            <CollectionAndSetsSection
                session={session}
                contentType={reviseModalType || "collection"}
                tagsCollection={tagsCollection}
                setSelectedSets={setSelectedSets}
                selectedSets={selectedSets}
                setSelectedTags={setSelectedTags}
                setFetchLoading={setFetchLoading}
            />
            <TagsModalSection
                allTags={allTags}
                selectedTags={selectedTags}
                setAllTags={setAllTags}
                sliderTagsHandler={sliderTagsHandler}
                selectedTagListHandler={selectedTagListHandler}
                availableTags={availableTags}
            />
            <DifficultyModalSection
                allDiff={allDiff}
                selectedDiff={selectedDiff}
                setSelectedDiff={setSelectedDiff}
                setReviseAll={setReviseAll}
                reviseAll={reviseAll}
                sliderDifficultyHandler={sliderDifficultyHandler}
            />
            <AvailableQuestionSection
                selectedSets={selectedSets}
                filteredFlashItems={filteredFlashItems}
                allDiff={allDiff}
                allTags={allTags}
                fetchLoading={fetchLoading}
            />

            <Button
                text="Start"
                handler={startRevisionHandler}
                disabled={filteredFlashItems.length > 0 ? false : true}
            />
        </section>
    );
}

export default ReviseCollectionModalContent;
