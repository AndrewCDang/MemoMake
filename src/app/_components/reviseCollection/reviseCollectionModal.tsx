"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import SliderToggle from "../sliderToggle/sliderToggle";
import style from "./reviseCards.module.scss";
import CornerClose from "../cornerClose/cornerClose";
import Button from "../(buttons)/styledButton";
import {
    Flashcard_item,
    Flashcard_set,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import TextInput from "../textInput/inputField";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { tagsCollectionTypes } from "@/app/_actions/fetchTagsInCollection";
import ExpandHeightToggler from "../expandHeightToggler/expandHeightToggler";
import { colours } from "@/app/styles/colours";
import { fetchItemsFromSets } from "@/app/_actions/fetchItemsFromSets";
import LoadingSpin from "../svgs";
import TickValidate from "../tickValidate/tickValidate";
import { useRouter } from "next/navigation";
import useRevisionFlashItems from "@/app/_hooks/useRevisionFlashItems";
import { useReviseModal } from "./useReviseModal";
import Modal from "../modal/modal";
import TagsModalSection from "./components/tagsModalSection";
import DifficultyModalSection from "./components/difficultyModalSection";
import AvailableQuestionSection from "./components/availableQuestionsSection";

// steps
// 1.Display initial collection/set and list its associated flash card items
// 2.Display all its possible tags from the intial collection/set
// 3.Create toggle - false = does not allow user to add new items. True = allows user to add new items, which updates the array of flashcard items
// 4.Redirects to test page which includes url params of settings and collection/set ids, flashcards already loaded into client, ready to start.
// if user is accessing this page from link, flashcard items missing from client, will be fetched via information provided by url params.

type ReviseCollectionModalTypes = {
    initialSet?: Flashcard_set;
    initialItems: Flashcard_item[];
    collectionSet?: Flashcard_set_with_count[];
    tagsCollection: tagsCollectionTypes[];
};

export type diffOptions = "NA" | "EASY" | "MEDIUM" | "HARD";


function ReviseCollectionModal(
    {
        // initialSet,
        // initialItems,
        collectionSet=[],
        // tagsCollection,
    }:ReviseCollectionModalTypes
) {
    const { initialCollectionItems, isReviseModalOn, hideReviseModal, initialSet } =
        useReviseModal();

    const getCollectionItems = (fetch: "flashcards" | "tags") => {
        if (initialCollectionItems) {
            const array = initialCollectionItems.flatMap((collection) =>
                collection.sets.flatMap((set) => set.flashcards)
            );

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

            switch (fetch) {
                case "flashcards":
                    return array as Flashcard_item[];
                case "tags":
                    return tags as string[];
                default:
                    break;
            }
        }
        return undefined;
    };

    const router = useRouter();
    const [parent] = useAutoAnimate();
    const [reviseAll, setReviseAll] = useState<boolean>(true);
    const [allTags, setAllTags] = useState<boolean>(true);
    const [allDiff, setAllDiff] = useState<boolean>(true);

    const [searchSetInput, setSearchSetInput] = useState<string>("");

    const [selectedSets, setSelectedSets] = useState<Flashcard_set_with_cards[]>(
        initialSet.length>0 ? initialSet : []
    );

    useEffect(() => {}, [initialCollectionItems]);

    const [addSetModal, setAddSetModal] = useState<boolean>(false);

    // Available Tags via filtering through selecteditems
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [tagsCollection, setTagsCollection] = useState<string[] | undefined>(
        getCollectionItems("tags") as string[] | undefined
    );

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

            useEffect(()=>{
                console.log(availableTags)
            },[availableTags])

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

    const initalItemsFromCollection = getCollectionItems('flashcards') as Flashcard_item[]

    const [fetchedItems, setFetchedItems] = useState<Flashcard_item[]>(
        initalItemsFromCollection && initalItemsFromCollection.length>0 ? [
        ...initalItemsFromCollection
    ] : []
    );

    const [fetchLoading, setFetchLoading] = useState<boolean>(false);

    const fetchFlashItems = async (latestId: string) => {
        if (selHistory.includes(latestId)) return;
        const currCollection = [...selHistory, latestId];
        setFetchLoading(true);
        const fetchItems = await fetchItemsFromSets({ setIds: currCollection });
        if (!fetchItems) return;
        setFetchedItems(fetchItems);
        setSelHistory((prevState) => {
            return [...prevState, latestId];
        });
        setFetchLoading(false);
    };

    // Filtering Fetched items By Tags and difficulties if applicable

    const filterByTags = allTags
        ? fetchedItems
        : fetchedItems.filter((item) =>
              item.item_tags.some((tagItem) => selectedTags.includes(tagItem))
          );

    const filterThenByDifficulties = allDiff
        ? filterByTags
        : filterByTags.filter((item) => selectedDiff.includes(item.difficulty));

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

    // const setListHandler = (item: Flashcard_set) => {
    //     if (selectedSets.some((selItem) => item.id === selItem.id)) {
    //         // Removing selected tags associated with removed set
    //         setSelectedTags((prevTags) => {
    //             const tagsToRemove = tagsCollection
    //                 .filter((tags) => tags.id === item.id)
    //                 .map((item) => item.item_tags)[0];

    //             const remainingTags = prevTags.filter(
    //                 (prevTag) => !tagsToRemove.includes(prevTag)
    //             );

    //             return remainingTags;
    //         });

    //         // Removes set
    //         setSelectedSets((prevState) => {
    //             const remainingSets = prevState.filter((prevItem) =>
    //                 selectedSets.some((selItem) => prevItem.id !== item.id)
    //             );
    //             return remainingSets;
    //         });
    //     } else {
    //         setSelectedSets((prevState) => {
    //             return [...prevState, item];
    //         });
    //     }
    // };

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
        <Modal
            modalTitle="Collection Preview"
            modalOn={isReviseModalOn}
            closeHandler={hideReviseModal}
        >
            <section className={style.cardModal}>
                <div className={style.setCardSection}>
                    <div>Modal Set Test</div>
                    <h5>Select set(s)</h5>
                    <section className={style.stateCheckValidation}>
                        {/* <div>Selected set{selectedSets.length > 1 ? "s" : ""}</div>
                    <TickValidate
                        condition={selectedSets.length > 0 ? true : false}
                    /> */}
                    </section>
                    <div ref={parent} className={style.setCardContainer}>
                        {/* Collection */}
                        {initialCollectionItems &&
                            initialCollectionItems.map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        className={style.setCard}
                                    >
                                        <CornerClose
                                            cornerSpace="tight"
                                            handler={() => console.log("hi")}
                                            // handler={() => setListHandler(item)}
                                        />
                                        <div className={style.setCardTitle}>
                                            {item.collection_name}
                                        </div>
                                    </div>
                                );
                            })}
                        {/* Sets */}
                        {/* {selectedSets.map((item) => {
                        return (
                            <div key={item.id} className={style.setCard}>
                                <CornerClose
                                    cornerSpace="tight"
                                    handler={()=>console.log('hi')}
                                    // handler={() => setListHandler(item)}
                                />
                                <div className={style.setCardTitle}>
                                    {item.set_name}
                                </div>
                            </div>
                        );
                    })} */}
                        {!addSetModal && (
                            <div
                                onClick={() =>
                                    setAddSetModal((prevState) => !prevState)
                                }
                                className={style.addCardSet}
                            >
                                <div>+ Set</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Set Modal | Text input | Selectable Set List */}

                {/* <section
                style={{
                    display: "grid",
                    gridTemplateRows:
                        addSetModal &&
                        collectionSet.length > selectedSets.length
                            ? "1fr"
                            : "0fr",
                    transition: "0.2s ease-in-out",
                }}
            >
                <section
                    className={style.insertSetWrapper}
                    style={{ overflow: "hidden" }}
                >
                    <section
                        style={{ overflow: "hidden" }}
                        className={style.insertSetContainer}
                    >
                        <TextInput
                            type="text"
                            id={"otherSets"}
                            placeholder="Search for set"
                            handler={searchSetHandler}
                            keyDownHandler={keydownHandler}
                            inputValue={searchSetInput}
                        />
                        <div className={style.setSuggestionList}>
                            <input
                                className={style.insertSetCheckbox}
                                type="checkbox"
                                checked={searchSetInput ? true : false}
                            ></input>
                            {filteredList.length > 0 &&
                                filteredList.map((item) => {
                                    return (
                                        <div
                                            onClick={() => (
                                                fetchFlashItems(item.id),
                                                setListHandler(item)
                                            )}
                                            key={item.id}
                                        >
                                            {item.set_name}
                                            <span className={style.itemCount}>
                                                {item.count} card
                                                {item.count > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </section>
            </section> */}
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
                <AvailableQuestionSection/>
                

                {/* <Button
                    text="Start"
                    // handler={startRevisionHandler}
                    disabled={
                        selectedSets.length > 0 && filteredFlashItems.length > 0
                            ? false
                            : true
                    }
                /> */}
            </section>
        </Modal>
    );
}

export default ReviseCollectionModal;
