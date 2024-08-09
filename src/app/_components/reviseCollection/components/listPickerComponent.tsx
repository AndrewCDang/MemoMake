import {
    ContentType,
    Flashcard_collection,
    Flashcard_collection_preview,
    Flashcard_collection_with_count,
    Flashcard_set,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "../reviseCards.module.scss";
import TextInput from "../../textInput/inputField";
import { useReviseModal } from "../useReviseModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import { DotIconsSetCollection } from "./collectionAndSetsSelectedObjects";

type ListPickerTypes = {
    searchList: Flashcard_collection_with_count[] | Flashcard_set_with_count[];
    addSetModal: boolean;
    selectedSets: Flashcard_set_with_cards[] | Flashcard_set[];
    filteredList:
        | Flashcard_collection_with_count[]
        | Flashcard_set_with_count[]
        | undefined;
    contentType: ContentType;
    setFetchLoading: Dispatch<SetStateAction<boolean>>;
    fetchFlashCards?: boolean;
};

function ListPickerComponent({
    searchList,
    addSetModal,
    selectedSets,
    filteredList,
    contentType,
    setFetchLoading,
    fetchFlashCards = true,
}: ListPickerTypes) {
    // Global States
    const {
        initialCollectionItems,
        setInitialCollectionItems,
        initialSetItems,
        setInitalSet,
    } = useReviseModal();

    const fetchFlashItems = async (latestId: string) => {
        if (!initialCollectionItems.map((item) => item.id).includes(latestId)) {
            try {
                const fetchCollection = await fetchSetsWithItems({
                    fetchObject: { type: contentType, id: latestId },
                });
                if (fetchCollection) {
                    if (contentType === "collection") {
                        setInitialCollectionItems({
                            existingItems: initialCollectionItems,
                            item: fetchCollection as Flashcard_collection_preview,
                        });
                    }
                    if (contentType === "set") {
                        setInitalSet({
                            existingItems: initialSetItems,
                            item: fetchCollection as Flashcard_set_with_cards[],
                        });
                    }
                }
            } catch (error: unknown) {}
        } else {
            console.log(`Currently selected: ${latestId}`);
        }
        setFetchLoading(false);
    };
    //Adding to selection list but not fetching additional flashcards information belonging to sets/collections - this is only fetched immediately prior to studying
    const addFlashitems = (
        item: Flashcard_collection_with_count | Flashcard_set_with_count
    ) => {
        try {
            if (contentType === "collection") {
                const collectionItem = item as Flashcard_collection_with_count;
                setInitialCollectionItems({
                    existingItems: initialCollectionItems,
                    item: collectionItem,
                });
            }
            if (contentType === "set") {
                const setItem = {
                    ...item,
                    flashcards: Array(Number(item.item_count)).fill(undefined),
                } as Flashcard_set_with_cards;
                setInitalSet({
                    existingItems: initialSetItems,
                    item: [setItem],
                });
            }
        } catch (error: unknown) {}
        setFetchLoading(false);
    };

    // Set Search function
    const [searchSetInput, setSearchSetInput] = useState<string>("");

    const searchSetHandler = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchSetInput(e.target.value);
    };

    const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const typedList =
        filteredList &&
        filteredList.filter((item) => {
            if (contentType === "set") {
                return (item as Flashcard_set_with_count).set_name
                    .toLowerCase()
                    .includes(searchSetInput?.toLowerCase() || "");
            }
            if (contentType === "collection") {
                return (item as Flashcard_collection).collection_name
                    .toLowerCase()
                    .includes(searchSetInput?.toLowerCase() || "");
            }
        });

    const keydownHandler = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            setSearchSetInput("");
            if (typedList && typedList.length > 0 && typedList[0]) {
                const suggestedFirstItem = typedList[0];
                fetchFlashItems(suggestedFirstItem.id);
            }
        }
    };

    const typeOrFilteredList =
        searchSetInput.length > 0 ? typedList : filteredList;

    // Focus the input field after state update
    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [searchSetInput]);

    return (
        <section
            style={{
                display: "grid",
                gridTemplateRows:
                    addSetModal && searchList.length > selectedSets.length
                        ? "1fr"
                        : "0fr",
                transition: "grid-template-rows 0.2s ease-in-out",
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
                    <div className={style.setSuggestionList}>
                        <input
                            className={style.insertSetCheckbox}
                            type="checkbox"
                            defaultChecked={searchSetInput ? true : false}
                        ></input>
                        {typeOrFilteredList &&
                            typeOrFilteredList.length > 0 &&
                            typeOrFilteredList.map((item) => {
                                return (
                                    <div
                                        onClick={() =>
                                            fetchFlashCards
                                                ? fetchFlashItems(item.id)
                                                : addFlashitems(item)
                                        }
                                        key={item.id}
                                        className={style.searchItemWrap}
                                    >
                                        <div className={style.searchItemName}>
                                            <DotIconsSetCollection
                                                item={
                                                    item as
                                                        | Flashcard_set
                                                        | Flashcard_collection_preview
                                                }
                                                contentType={contentType}
                                            />
                                            <span>
                                                {contentType === "collection"
                                                    ? `${
                                                          (
                                                              item as Flashcard_collection_with_count
                                                          ).collection_name +
                                                          " "
                                                      }`
                                                    : (
                                                          item as Flashcard_set_with_count
                                                      ).set_name}
                                            </span>
                                        </div>
                                        <span className={style.itemCount}>
                                            {
                                                (
                                                    item as
                                                        | Flashcard_collection_with_count
                                                        | Flashcard_set_with_count
                                                ).item_count
                                            }
                                            card
                                            {(
                                                item as Flashcard_collection_with_count
                                            ).item_count > 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                    <TextInput
                        refObject={textInputRef}
                        height="short"
                        type="text"
                        id={"otherSets"}
                        placeholder="Search for set"
                        handler={searchSetHandler}
                        keyDownHandler={keydownHandler}
                        inputValue={searchSetInput}
                    />
                </section>
            </section>
        </section>
    );
}

export default ListPickerComponent;
