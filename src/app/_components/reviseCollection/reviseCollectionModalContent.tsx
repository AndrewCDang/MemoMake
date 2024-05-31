"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import style from "./reviseCards.module.scss";
import Button from "../(buttons)/styledButton";
import {
    Flashcard_item,
    Flashcard_set,
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
// steps
// 1.Display initial collection/set and list its associated flash card items
// 2.Display all its possible tags from the intial collection/set
// 3.Create toggle - false = does not allow user to add new items. True = allows user to add new items, which updates the array of flashcard items
// 4.Redirects to test page which includes url params of settings and collection/set ids, flashcards already loaded into client, ready to start.
// if user is accessing this page from link, flashcard items missing from client, will be fetched via information provided by url params.

type ReviseCollectionModalContentTypes = {
    session:Session;
    // initialSet?: Flashcard_set;
    // initialItems: Flashcard_item[];
    collectionSet?: Flashcard_set_with_count[];
    // tagsCollection: tagsCollectionTypes[];
};

export type diffOptions = "NA" | "EASY" | "MEDIUM" | "HARD";

function ReviseCollectionModalContent({
    session,
    // initialSet,
    // initialItems,
    collectionSet = [], 
}: // tagsCollection,
ReviseCollectionModalContentTypes) {
    const {
        initialCollectionItems,
        isReviseModalOn,
        hideReviseModal,
        initialSet,
    } = useReviseModal();

    const router = useRouter();
    const [reviseAll, setReviseAll] = useState<boolean>(true);
    const [allTags, setAllTags] = useState<boolean>(true);
    const [allDiff, setAllDiff] = useState<boolean>(true);
    const [searchSetInput, setSearchSetInput] = useState<string>("");

    const getCollectionItems = (fetch: "flashcards" | "tags") => {
        if (initialCollectionItems) {
            const array = initialCollectionItems.flatMap((collection) =>
                collection.sets.flatMap((set) => set.flashcards)
            );
    
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
    >(initialSet.length > 0 ? initialSet : []);

    const [addSetModal, setAddSetModal] = useState<boolean>(false);

    // Available Tags via filtering through selecteditems
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tagsCollection = getCollectionItems("tags") as string[]

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

    const [selHistory, setSelHistory] = useState<string[]>(
        // initialSet?.id ? [initialSet.id] : []
        []
    );

    const initalItemsFromCollection = getCollectionItems(
        "flashcards"
    ) as Flashcard_item[];


    // const [fetchedItems, setFetchedItems] = useState<Flashcard_item[]>(
    //     initalItemsFromCollection
    
    // );

    const fetchedItems = [...initalItemsFromCollection]

    const [fetchLoading, setFetchLoading] = useState<boolean>(false);

    // const fetchFlashItems = async (latestId: string) => {
    //     if (selHistory.includes(latestId)) return;
    //     const currCollection = [...selHistory, latestId];
    //     setFetchLoading(true);
    //     const fetchItems = await fetchItemsFromSets({ setIds: currCollection });
    //     if (!fetchItems) return;
    //     setFetchedItems(fetchItems);
    //     setSelHistory((prevState) => {
    //         return [...prevState, latestId];
    //     });
    //     setFetchLoading(false);
    // };

    // Filtering Fetched items By Tags and difficulties if applicable

    const filterByTags = allTags
        ? fetchedItems
        : fetchedItems.filter((item) =>
              item && item.item_tags.some((tagItem) => selectedTags.includes(tagItem))
          );

    const filterThenByDifficulties = allDiff
        ? filterByTags
        : filterByTags.filter((item) => item && selectedDiff.includes(item.difficulty));

    const filteredFlashItems = filterThenByDifficulties;

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

    // Set Search function
    // const searchSetHandler = async (
    //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    // ) => {
    //     setSearchSetInput(e.target.value);
    // };

    const filteredList =
        searchSetInput || selectedSets
            ? collectionSet
                  .filter((item) =>
                      item.set_name
                          .toLowerCase()
                          .includes(searchSetInput?.toLowerCase() || "")
                  )
                  .filter(
                      (item) => !selectedSets.some((obj) => obj.id === item.id)
                  )
            : collectionSet;

    // const keydownHandler = (
    //     e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    // ) => {
    //     if (e.key === "Enter") {
    //         setSearchSetInput("");
    //         if (filteredList.length > 0 && filteredList[0]) {
    //             const suggestedFirstItem = filteredList[0];
    //             setListHandler(suggestedFirstItem);
    //         }
    //     }
    // };

    // Setting Revision items providing validated conditions
    // const { setQuestions, setIncorrectQuestions, incorrectQuestions } =
    //     useRevisionFlashItems();

    // const startRevisionHandler = () => {
    //     if (filteredFlashItems.length > 0) {
    //         setQuestions(filteredFlashItems);
    //         if (incorrectQuestions.length > 0) setIncorrectQuestions([]);
    //         router.push("/study");
    //     }
    // };

    // Collection ->> set initial set, mapping sets of all columns. Appending it to set array.

    return (
            <section className={style.cardModal}>
                <CollectionAndSetsSection session={session} tagsCollection={tagsCollection} setSelectedSets={setSelectedSets} selectedSets={selectedSets} addSetModal={addSetModal} setAddSetModal={setAddSetModal} setSelectedTags={setSelectedTags}/>
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
                    fetchLoading ={fetchLoading}
                />

                <Button
                    text="Start"
                    // handler={startRevisionHandler}
                    disabled={
                        selectedSets.length > 0 && filteredFlashItems.length > 0
                            ? false
                            : true
                    }
                />
            </section>
    );
}

export default ReviseCollectionModalContent;
