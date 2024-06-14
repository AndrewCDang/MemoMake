"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import style from "../reviseCards.module.scss";
import { getSession } from "next-auth/react";
import { useReviseModal } from "../useReviseModal";
import CornerClose from "../../cornerClose/cornerClose";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import TickValidate from "../../tickValidate/tickValidate";
import {
    Flashcard_collection_preview,
    Flashcard_collection_with_count,
    Flashcard_item,
    Flashcard_set,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import { tagsCollectionTypes } from "@/app/_actions/fetchTagsInCollection";
import TextInput from "../../textInput/inputField";
import { fetchCollectionByIdWithSetAndItemCount } from "@/app/_actions/fetchCollectionByIdWithSetAndItemCount";
import { Session } from "next-auth";
import { fetchItemsFromSets } from "@/app/_actions/fetchItemsFromSets";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import CollectionAndSetsSelectedObjects from "./collectionAndSetsSelectedObjects";

type CollectionAndSetsSection = {
    session: Session;
    selectedSets: Flashcard_set_with_cards[];
    setSelectedTags: Dispatch<SetStateAction<string[]>>;
    tagsCollection: string[];
    setSelectedSets: Dispatch<SetStateAction<Flashcard_set_with_cards[]>>;
    setFetchLoading: Dispatch<SetStateAction<boolean>>;
    contentType: "collection" | "set";
};

function CollectionAndSetsSection({
    session,
    selectedSets,
    setFetchLoading,
    contentType,
}: CollectionAndSetsSection) {
    const [parent] = useAutoAnimate();
    // Modal States
    const [addSetModal, setAddSetModal] = useState<boolean>(false);

    // Global States
    const {
        initialCollectionItems,
        setInitialCollectionItems,
        isReviseModalOn,
        hideReviseModal,
        initialSetItems,
        setInitalSet,
        reviseModalType,
    } = useReviseModal();

    const [searchCollection, setSearchCollection] = useState<
        Flashcard_collection_with_count[] | Flashcard_set_with_count[]
    >([]);

    const [selectedSearchCollection, setSelectedSearchCOllection] = useState<
        Flashcard_collection_with_count[] | Flashcard_set_with_count[]
    >([]);

    const fetchCollectionWithCount = async () => {
        try {
            const userId = session.user.id;
            const fetch = await fetchCollectionByIdWithSetAndItemCount({
                type: contentType,
                userId: userId,
            });
            if (fetch) {
                const getInitialItems = () => {
                    if (contentType === "collection") {
                        return (
                            fetch as Flashcard_collection_with_count[]
                        ).filter((item) =>
                            initialCollectionItems
                                .map((item) => item.id)
                                .includes(item.id)
                        );
                    } else if (contentType === "set") {
                        return (fetch as Flashcard_set_with_count[]).filter(
                            (setItem) =>
                                initialSetItems
                                    .map((initialitem) => initialitem.id)
                                    .includes(setItem.id)
                        );
                    }
                };

                setSearchCollection(fetch);
                const initialItems = getInitialItems();
                if (!initialItems) return;
                setSelectedSearchCOllection(initialItems);
            }
            console.log(fetch);
        } catch (error) {
            console.error("Error fetching collection with count:", error);
        }
    };

    useEffect(() => {
        fetchCollectionWithCount();
        console.log("hi");
    }, []);

    // Set Search function
    const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [searchSetInput, setSearchSetInput] = useState<string>("");

    const searchSetHandler = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchSetInput(e.target.value);
    };

    // Focus the input field after state update
    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [searchSetInput]);

    // Selected objects from selectable list
    const [selectedObjects, setSelectedObjects] = useState<string[]>(
        contentType === "collection"
            ? initialCollectionItems.map((item) => item.id)
            : contentType === "set"
            ? initialSetItems.map((item) => item.id)
            : []
    );

    // Selectable List of dashboard items
    const filteredList =
        searchCollection.length > 0
            ? searchCollection
                  .filter((item) =>
                      contentType == "collection"
                          ? (
                                item as Flashcard_collection_with_count
                            ).collection_name
                                .toLowerCase()
                                .includes(searchSetInput?.toLowerCase())
                          : (item as Flashcard_set_with_count).set_name
                                .toLowerCase()
                                .includes(searchSetInput?.toLowerCase())
                  )
                  .filter((item) => !selectedObjects.includes(item.id))
            : searchCollection;

    const keydownHandler = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            setSearchSetInput("");
            if (filteredList.length > 0 && filteredList[0]) {
                const suggestedFirstItem = filteredList[0];
                fetchFlashItems(suggestedFirstItem.id);
            }
        }
    };

    const fetchFlashItems = async (latestId: string) => {
        if (!initialCollectionItems.map((item) => item.id).includes(latestId)) {
            console.log(`Not currently selected: ${latestId}`);
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
                        setSelectedObjects((prevState) => {
                            if (
                                !prevState.includes(
                                    (
                                        fetchCollection as Flashcard_collection_preview
                                    ).id
                                )
                            ) {
                                return [
                                    ...prevState,
                                    (
                                        fetchCollection as Flashcard_collection_preview
                                    ).id,
                                ];
                            }
                            return prevState;
                        });
                    }
                    if (contentType === "set") {
                        setInitalSet({
                            existingItems: initialSetItems,
                            item: fetchCollection as Flashcard_set_with_cards[],
                        });
                        setSelectedObjects((prevState) => {
                            const unselectedSets = (
                                fetchCollection as Flashcard_set_with_cards[]
                            ).filter((item) => !prevState.includes(item.id));
                            if (unselectedSets.length > 0) {
                                const unselectedIds = unselectedSets.map(
                                    (item) => item.id
                                );
                                return [...prevState, ...unselectedIds];
                            }
                            return prevState;
                        });
                    }
                }
                console.log(fetchCollection);
            } catch (error: unknown) {}
        } else {
            console.log(`Currently selected: ${latestId}`);
        }
        setFetchLoading(false);
    };

    const ListPickerComponent = ({
        searchList,
    }: {
        searchList:
            | Flashcard_collection_with_count[]
            | Flashcard_set_with_count[];
    }) => {
        // searchList = collectionSet;
        return (
            <section
                style={{
                    display: "grid",
                    gridTemplateRows:
                        addSetModal && searchList.length > selectedSets.length
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
                            refObject={textInputRef}
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
                                defaultChecked={searchSetInput ? true : false}
                            ></input>
                            {filteredList.length > 0 &&
                                filteredList.map((item) => {
                                    return (
                                        <div
                                            onClick={
                                                () => fetchFlashItems(item.id)
                                                // setListHandler(item)
                                            }
                                            key={item.id}
                                        >
                                            <span
                                                className={style.searchItemName}
                                            >
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
                                            <span className={style.itemCount}>
                                                {contentType === "collection"
                                                    ? (
                                                          item as Flashcard_collection_with_count
                                                      ).item_count
                                                    : (
                                                          item as Flashcard_set_with_count
                                                      ).item_count}
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
                    </section>
                </section>
            </section>
        );
    };

    return (
        <>
            <div className={style.setCardSection}>
                <section className={style.stateCheckValidation}>
                    <div>
                        Selected{" "}
                        {contentType === "collection"
                            ? "collection"
                            : contentType === "set"
                            ? "set"
                            : ""}
                        {selectedObjects.length > 1 ? "s" : ""}
                    </div>
                    <TickValidate
                        condition={selectedObjects.length > 0 ? true : false}
                    />
                </section>
                <div ref={parent} className={style.setCardContainer}>
                    {/* Selected collections/sets */}
                    <CollectionAndSetsSelectedObjects />
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
            <ListPickerComponent searchList={searchCollection} />
        </>
    );
}

export default CollectionAndSetsSection;
