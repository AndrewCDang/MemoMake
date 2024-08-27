"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import style from "../reviseCards.module.scss";
import { useReviseModal } from "../useReviseModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TickValidate from "../../tickValidate/tickValidate";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import { Session } from "next-auth";
import CollectionAndSetsSelectedObjects from "./collectionAndSetsSelectedObjects";
import ListPickerComponent from "./listPickerComponent";
import { HiChevronRight } from "react-icons/hi2";

type CollectionAndSetsSection = {
    session: Session | undefined;
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
    const { initialCollectionItems, initialSetItems } = useReviseModal();

    const [searchCollection, setSearchCollection] = useState<
        Flashcard_collection_with_count[] | Flashcard_set_with_count[]
    >([]);

    const fetchCollectionWithCount = async () => {
        try {
            if (!session) return;
            const userId = session.user.id;
            const response = await fetch(
                `/api/fetch/fetchCollectionHandler?type=${contentType}&userId=${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const responseData = await response.json();
                const getInitialItems = () => {
                    if (contentType === "collection") {
                        return (
                            responseData.data as Flashcard_collection_with_count[]
                        ).filter((item) =>
                            initialCollectionItems
                                .map((item) => item.id)
                                .includes(item.id)
                        );
                    } else if (contentType === "set") {
                        return (
                            responseData.data as Flashcard_set_with_count[]
                        ).filter((setItem) =>
                            initialSetItems
                                .map((initialitem) => initialitem.id)
                                .includes(setItem.id)
                        );
                    }
                };

                setSearchCollection(responseData.data);
                const initialItems = getInitialItems();
                if (!initialItems) return;
            }
        } catch (error) {
            console.error("Error fetching collection with count:", error);
        }
    };

    useEffect(() => {
        fetchCollectionWithCount();
    }, []);

    // Selected objects from selectable list
    const selectedObjects =
        contentType === "collection"
            ? initialCollectionItems
            : contentType === "set"
            ? initialSetItems
            : [];

    // Selectable List of dashboard items
    const getFilteredLlist = () => {
        if (contentType === "collection" && searchCollection.length > 0) {
            const selectedIds = initialCollectionItems.flatMap(
                (item) => item.id
            );
            const filteredList = (
                searchCollection as Flashcard_collection_with_count[]
            )
                .filter((item) => !selectedIds.includes(item.id))
                .filter((item) => item.item_count > 0);

            return filteredList as Flashcard_collection_with_count[];
        } else if (contentType === "set") {
            const selectedIds = initialSetItems.flatMap((item) => item.id);
            const filteredList = (
                searchCollection as Flashcard_set_with_count[]
            )
                .filter((item) => !selectedIds.includes(item.id))
                .filter((item) => item.item_count > 0);

            return filteredList;
        }
    };
    const filteredList = getFilteredLlist();

    return (
        <div>
            <div className={style.setCardSection}>
                {/* Title */}
                <section className={style.stateCheckValidation}>
                    <div>
                        Selected{" "}
                        {contentType === "collection"
                            ? "collection"
                            : contentType === "set"
                            ? "setsssss"
                            : ""}
                        {selectedObjects.length > 1 ? "s" : ""}
                    </div>
                    <TickValidate
                        condition={selectedObjects.length > 0 ? true : false}
                    />
                </section>
                {/* Section showing selected Sets */}
                <div ref={parent} className={style.setCardContainer}>
                    <CollectionAndSetsSelectedObjects />
                    {/* Button which shows selectable sets to add */}
                    {session && (
                        <button
                            onClick={() =>
                                setAddSetModal((prevState) => !prevState)
                            }
                            className={style.addCardSet}
                        >
                            <div>{!addSetModal ? "Add Set" : "Hide Menu"}</div>
                            <div>
                                <HiChevronRight
                                    style={{
                                        transform: !addSetModal
                                            ? "rotate(0deg)"
                                            : "rotate(90deg)",
                                    }}
                                />
                            </div>
                        </button>
                    )}
                </div>
            </div>
            {/* Add Set Modal | Text input | Selectable Set List */}
            {session && (
                <ListPickerComponent
                    searchList={searchCollection}
                    addSetModal={addSetModal}
                    selectedSets={selectedSets}
                    filteredList={filteredList}
                    contentType={contentType}
                    setFetchLoading={setFetchLoading}
                />
            )}
        </div>
    );
}

export default CollectionAndSetsSection;
