"use client"
import { useAutoAnimate } from "@formkit/auto-animate/react";
import style from "../reviseCards.module.scss";
import { getSession } from "next-auth/react";
import { useReviseModal } from "../useReviseModal";
import CornerClose from "../../cornerClose/cornerClose";
import { Dispatch, SetStateAction, useEffect } from "react";
import TickValidate from "../../tickValidate/tickValidate";
import { Flashcard_set, Flashcard_set_with_cards } from "@/app/_types/types";
import { tagsCollectionTypes } from "@/app/_actions/fetchTagsInCollection";
import TextInput from "../../textInput/inputField";
import { fetchCollectionByIdWithSetAndItemCount } from "@/app/_actions/fetchCollectionByIdWithSetAndItemCount";
import { Session } from "next-auth";

type CollectionAndSetsSection = {
    session:Session
    addSetModal:boolean;
    setAddSetModal:Dispatch<SetStateAction<boolean>>;
    selectedSets:Flashcard_set_with_cards[];
    setSelectedTags:Dispatch<SetStateAction<string[]>>;
    tagsCollection: string[];
    setSelectedSets: Dispatch<SetStateAction<Flashcard_set_with_cards[]>>;
}


function CollectionAndSetsSection({session, tagsCollection, addSetModal,setAddSetModal, selectedSets, setSelectedTags, setSelectedSets}:CollectionAndSetsSection) {
    const {
        initialCollectionItems,
        isReviseModalOn,
        hideReviseModal,
        initialSet,
    } = useReviseModal();
    
    const fetchCollectionWithCount = async() => {
        try {
            const userId = session.user.id;
            console.log(userId);
            const fetch = await fetchCollectionByIdWithSetAndItemCount({ userId: userId });
            console.log(fetch);
        } catch (error) {
            console.error('Error fetching collection with count:', error);
        }
    }
    const [parent] = useAutoAnimate();



    useEffect(()=>{
        fetchCollectionWithCount()
    },[])

        const setListHandler = (item: Flashcard_set_with_cards) => {
        if (selectedSets.some((selItem) => item.id === selItem.id)) {
            // Removing selected tags associated with removed set
            // setSelectedTags((prevTags) => {
            //     // const tagsToRemove = tagsCollection
            //     //     .filter((tags) => tags.id === item.id)
            //     //     .map((item) => item.item_tags)[0];

            //     //     item.

            //     // const remainingTags = prevTags.filter(
            //     //     (prevTag) => !tagsToRemove.includes(prevTag)
            //     // );

            //     // return remainingTags;
            // });

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



  return (
    <>
    <div className={style.setCardSection}>
    <h5>Select Collections(s)</h5>
    <section className={style.stateCheckValidation}>

        <div>Selected set{selectedSets.length > 1 ? "s" : ""}</div>
    <TickValidate
        condition={selectedSets.length > 0 ? true : false}
    />
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
            </>
  )
}

export default CollectionAndSetsSection