"use client";

import React, { ChangeEvent, useState } from "react";
import SliderToggle from "../sliderToggle/sliderToggle";
import style from "./reviseCards.module.scss";
import CornerClose from "../cornerClose/cornerClose";
import Button from "../(buttons)/styledButton";
import {
    Flashcard_item,
    Flashcard_set,
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
import { UseReviseModal } from "./useReviseModal";

// steps
// 1.Display initial collection/set and list its associated flash card items
// 2.Display all its possible tags from the intial collection/set
// 3.Create toggle - false = does not allow user to add new items. True = allows user to add new items, which updates the array of flashcard items
// 4.Redirects to test page which includes url params of settings and collection/set ids, flashcards already loaded into client, ready to start.
    // if user is accessing this page from link, flashcard items missing from client, will be fetched via information provided by url params.


type ReviseCollectionModalTypes = {
    initialSet?: Flashcard_set;
    initialItems: Flashcard_item[];
    collectionSet: Flashcard_set_with_count[];
    tagsCollection: tagsCollectionTypes[];
};

function ReviseCollectionModal({
    // initialSet,
    // initialItems,
    // collectionSet,
    // tagsCollection,
}) {
    const {initialCollectionItems} = UseReviseModal()

    const router = useRouter();
    const [parent] = useAutoAnimate();
    const [reviseAll, setReviseAll] = useState<boolean>(true);
    const [allTags, setAllTags] = useState<boolean>(true);
    const [allDiff, setAllDiff] = useState<boolean>(true);

    const [searchSetInput, setSearchSetInput] = useState<string>("");
    const [selectedSets, setSelectedSets] = useState<Flashcard_set[]>(
        initialSet?.id ? [initialSet] : []
    );
    const [addSetModal, setAddSetModal] = useState<boolean>(false);

    // Available Tags via filtering through selecteditems
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // const availableTags = tagsCollection
    //     .filter((tagSet) =>
    //         selectedSets.some(
    //             (selSet) =>
    //                 selSet.id === tagSet.id && tagSet.item_tags.length > 0
    //         )
    //     )
    //     .map((item) => item.item_tags)
    //     .flat()
    //     .filter((item) => !selectedTags.includes(item))
    //     .sort((a: string, b: string) => {
    //         let lowerA = a.toLowerCase();
    //         let lowerB = b.toLowerCase();

    //         if (lowerA < lowerB) {
    //             return -1;
    //         }
    //         if (lowerA > lowerB) {
    //             return 1;
    //         }
    //         // When equal
    //         return 0;
    //     });

    // const selectedTagListHandler = (tag: string) => {
    //     if (selectedTags.includes(tag)) {
    //         setSelectedTags((prevState) => {
    //             const previousArray = prevState.filter((prev) => prev !== tag);
    //             return previousArray;
    //         });
    //     } else {
    //         setSelectedTags((prevState) => {
    //             return [...prevState, tag];
    //         });
    //     }
    // };

    // Available Difficulty Options
    type diffOptions = "NA" | "EASY" | "MEDIUM" | "HARD";
    const [selectedDiff, setSelectedDiff] = useState<diffOptions[]>([]);
    const diffArray: diffOptions[] = ["NA", "EASY", "MEDIUM", "HARD"];

    const selectableDiffArray = diffArray.filter(
        (item) => !selectedDiff.includes(item)
    );

    const labelColour = (diff: string) => {
        switch (diff) {
            case "NA":
                return colours.grey();
            case "EASY":
                return colours.green();
            case "MEDIUM":
                return colours.yellow();
            case "HARD":
                return colours.red();
            default:
        }
    };

    const selectedDifficultyHandler = (item: diffOptions) => {
        if (selectedDiff.includes(item)) {
            setSelectedDiff((prevState) => {
                const previousArray = prevState.filter((prev) => prev !== item);
                return previousArray;
            });
        } else {
            setSelectedDiff((prevState) => {
                return [...prevState, item];
            });
        }
    };

    // Fetching flashcard items from selected sets

    // const [selHistory, setSelHistory] = useState<string[]>(
    //     initialSet?.id ? [initialSet.id] : []
    // );

    // const [fetchedItems, setFetchedItems] = useState<Flashcard_item[]>([
    //     ...initialItems,
    // ]);

    // const [fetchLoading, setFetchLoading] = useState<boolean>(false);

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

    // const filterByTags = allTags
    //     ? fetchedItems
    //     : fetchedItems.filter((item) =>
    //           item.item_tags.some((tagItem) => selectedTags.includes(tagItem))
    //       );

    // const filterThenByDifficulties = allDiff
    //     ? filterByTags
    //     : filterByTags.filter((item) => selectedDiff.includes(item.difficulty));

    // const filteredFlashItems = filterThenByDifficulties;

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
    const searchSetHandler = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchSetInput(e.target.value);
    };

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

    const setListHandler = (item: Flashcard_set) => {
        if (selectedSets.some((selItem) => item.id === selItem.id)) {
            // Removing selected tags associated with removed set
            setSelectedTags((prevTags) => {
                const tagsToRemove = tagsCollection
                    .filter((tags) => tags.id === item.id)
                    .map((item) => item.item_tags)[0];

                const remainingTags = prevTags.filter(
                    (prevTag) => !tagsToRemove.includes(prevTag)
                );

                return remainingTags;
            });

            // Removes set
            setSelectedSets((prevState) => {
                const remainingSets = prevState.filter((prevItem) =>
                    selectedSets.some((selItem) => prevItem.id !== item.id)
                );
                return remainingSets;
            });
        } else {
            setSelectedSets((prevState) => {
                return [...prevState, item];
            });
        }
    };

    const keydownHandler = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            setSearchSetInput("");
            if (filteredList.length > 0 && filteredList[0]) {
                const suggestedFirstItem = filteredList[0];
                setListHandler(suggestedFirstItem);
            }
        }
    };

    // Setting Revision items providing validated conditions
    const { setQuestions, setIncorrectQuestions, incorrectQuestions } =
        useRevisionFlashItems();

    const startRevisionHandler = () => {
        if (filteredFlashItems.length > 0) {
            setQuestions(filteredFlashItems);
            if (incorrectQuestions.length > 0) setIncorrectQuestions([]);
            router.push("/study");
        }
    };

    return (
        <section className={style.cardModal}>
            <div className={style.setCardSection}>
                <h5>Select set(s)</h5>
                <section className={style.stateCheckValidation}>
                    <div>Selected set{selectedSets.length > 1 ? "s" : ""}</div>
                    <TickValidate
                        condition={selectedSets.length > 0 ? true : false}
                    />
                </section>
                <div ref={parent} className={style.setCardContainer}>
                    {selectedSets.map((item) => {
                        return (
                            <div key={item.id} className={style.setCard}>
                                <CornerClose
                                    cornerSpace="tight"
                                    handler={() => setListHandler(item)}
                                />
                                <div className={style.setCardTitle}>
                                    {item.set_name}
                                </div>
                            </div>
                        );
                    })}
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
            <section
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
            </section>
            <div>
                <h5 className={style.headingSpacing}>Tags</h5>
                {allTags ? (
                    <div className={style.defaultHeadingOption}>
                        <div>
                            Revise <span className={style.underline}>all</span>{" "}
                            Tags
                        </div>
                        <TickValidate condition={true} />
                    </div>
                ) : (
                    <section className={style.stateCheckValidation}>
                        <div>
                            Revise
                            <span className={style.underline}>Selected</span>
                            Tags
                        </div>
                        <TickValidate
                            condition={selectedTags.length > 0 ? true : false}
                        />
                    </section>
                )}
                <SliderToggle
                    name="allTags"
                    setChecked={setAllTags}
                    checked={allTags}
                    handler={sliderTagsHandler}
                    variant="coloured"
                />
                <ExpandHeightToggler isOn={!allTags}>
                    <section className={style.tagLabelsContainer}>
                        <div className={style.selectedTagsLabelContainer}>
                            <div className={style.selectedTagsHeader}>
                                <span className={style.labelSubTitle}>
                                    Selected Tags
                                </span>
                                {selectedTags.length < 1 && <label>None</label>}
                            </div>
                            <div
                                className={`${style.selectedLabelConatiner} ${style.labelContainer}`}
                            >
                                {selectedTags &&
                                    selectedTags.map((tag) => {
                                        return (
                                            <div
                                                onClick={() =>
                                                    selectedTagListHandler(tag)
                                                }
                                                className={style.label}
                                                key={tag}
                                            >
                                                {tag}
                                                <CornerClose
                                                    handler={() => ""}
                                                    type="circleCorner"
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className={style.tagsLabelContainer}>
                            <span className={style.labelSubTitle}>
                                Tags Available
                            </span>
                            <div className={style.labelContainer}>
                                {availableTags &&
                                    availableTags.map((tag) => {
                                        return (
                                            <div
                                                onClick={() =>
                                                    selectedTagListHandler(tag)
                                                }
                                                className={style.label}
                                                key={tag}
                                            >
                                                {tag}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </section>
                </ExpandHeightToggler>
            </div>
            <div>
                <h5 className={style.headingSpacing}>Difficulties</h5>
                {allDiff ? (
                    <div className={style.defaultHeadingOption}>
                        <div>
                            Revise <span className={style.underline}>all</span>{" "}
                            Difficulties
                        </div>
                        <TickValidate condition={true} />
                    </div>
                ) : (
                    <section className={style.stateCheckValidation}>
                        <div>
                            Revise
                            <span className={style.underline}>Selected</span>
                            Difficulties
                        </div>
                        <TickValidate
                            condition={selectedDiff.length > 0 ? true : false}
                        />
                    </section>
                )}
                <SliderToggle
                    name="allDifficulties"
                    setChecked={setReviseAll}
                    checked={reviseAll}
                    handler={sliderDifficultyHandler}
                    variant="coloured"
                />
                <ExpandHeightToggler isOn={!allDiff}>
                    <section className={style.tagLabelsContainer}>
                        <div className={style.selectedDiffContainer}>
                            <div className={style.selectedTagsHeader}>
                                <span className={style.labelSubTitle}>
                                    Selected Difficulties
                                </span>
                                {selectedDiff.length < 1 && <label>None</label>}
                            </div>
                            <div className={style.selectedLabelConatiner}>
                                {selectedDiff &&
                                    selectedDiff.map((item) => {
                                        return (
                                            <div
                                                onClick={() =>
                                                    selectedDifficultyHandler(
                                                        item
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        labelColour(item),
                                                }}
                                                className={style.label}
                                                key={item}
                                            >
                                                {item}
                                                <CornerClose
                                                    handler={() => ""}
                                                    type="circleCorner"
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className={style.tagsLabelContainer}>
                            <span className={style.labelSubTitle}>
                                Difficulties Available
                            </span>
                            <div>
                                {selectableDiffArray &&
                                    selectableDiffArray.map((item) => {
                                        return (
                                            <div
                                                onClick={() =>
                                                    selectedDifficultyHandler(
                                                        item
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        labelColour(item),
                                                }}
                                                className={style.label}
                                                key={item}
                                            >
                                                {item === "NA" ? "None" : item}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </section>
                </ExpandHeightToggler>
            </div>
            <div className={style.questionsContainer}>
                <h5>Questions</h5>
                {selectedSets.length > 0 && filteredFlashItems.length > 0 ? (
                    <div className={style.defaultHeadingOption}>
                        <div>
                            Revise
                            {allTags && allDiff ? " all " : " "}
                            {fetchLoading ? (
                                <div className={style.loadingSpinQuestion}>
                                    <LoadingSpin />
                                </div>
                            ) : (
                                filteredFlashItems.length + " "
                            )}
                            questions
                        </div>
                        <TickValidate condition={true} />
                    </div>
                ) : (
                    <>
                        <span className={style.stateCheckValidation}>
                            No questions or set available
                            <TickValidate condition={false} />
                        </span>
                    </>
                )}
            </div>
            <Button
                text="Start"
                handler={startRevisionHandler}
                disabled={
                    selectedSets.length > 0 && filteredFlashItems.length > 0
                        ? false
                        : true
                }
            />
        </section>
    );
}

export default ReviseCollectionModal;
