"use client";
import React from "react";
import { useReviseModal } from "../useReviseModal";
import CornerClose from "../../cornerClose/cornerClose";
import style from "../reviseCards.module.scss";
import { colours } from "@/app/styles/colours";
import {
    ContentType,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
} from "@/app/_types/types";

export const DotIconsSetCollection = ({
    contentType,
    item,
}: {
    contentType: ContentType;
    item:
        | Flashcard_set_with_cards
        | Flashcard_collection_preview
        | Flashcard_set;
}) => {
    const SetIcons = ({
        contentItem,
    }: {
        contentItem: Flashcard_set_with_cards;
    }) => {
        return (
            <div
                className={style.setIcon}
                style={{
                    backgroundColor:
                        colours[
                            contentItem.theme_colour
                                ? contentItem.theme_colour
                                : "lightGrey"
                        ](),
                }}
            ></div>
        );
    };
    if (contentType === "set") {
        const contentItem = item as Flashcard_set_with_cards;
        return <SetIcons contentItem={contentItem} />;
    }
    if (contentType === "collection") {
        const contentItem = item as Flashcard_collection_preview;
        return (
            <div className={style.collectionIconWrap}>
                {contentItem.sets.map((item) => {
                    return <SetIcons key={item.id} contentItem={item} />;
                })}
            </div>
        );
    }
};

const GetCardCount = ({
    item,
}: {
    item: Flashcard_collection_preview | Flashcard_set_with_cards;
}) => {
    const CardTemplate = ({ number }: { number: number }) => {
        return <span className={style.totalCards}>{number} cards</span>;
    };
    if ("collection_name" in item) {
        const cardCount = item.sets
            .flatMap((item) =>
                item.flashcards ? item.flashcards && item.flashcards.length : 0
            )
            .reduce((acc, curr) => acc + curr, 0);

        return <CardTemplate number={cardCount} />;
    } else if ("set_name" in item) {
        const cardCount =
            item && item.flashcards
                ? item.flashcards[0] !== null
                    ? item.flashcards.length
                    : 0
                : 0;
        return <CardTemplate number={cardCount} />;
    }
};

type SetCollectionCardTypes = {
    item: Flashcard_collection_preview | Flashcard_set_with_cards;
    removeFromSet: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_set_with_cards[];
    }) => void;
    removeFromCollection: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_collection_preview[];
    }) => void;
    initialSetItems: Flashcard_set_with_cards[];
    initialCollectionItems: Flashcard_collection_preview[];
    reviseModalType: ContentType;
};

const SetCollectionCard = ({
    item,
    removeFromSet,
    removeFromCollection,
    initialSetItems,
    initialCollectionItems,
    reviseModalType,
}: SetCollectionCardTypes) => {
    return (
        <div className={style.setCard}>
            <div className={style.setCardBanner}>
                <CornerClose
                    type="circleCorner"
                    cornerSpace="tight"
                    handler={() =>
                        reviseModalType === "set"
                            ? removeFromSet({
                                  id: item.id,
                                  existingItems: initialSetItems,
                              })
                            : reviseModalType === "collection"
                            ? removeFromCollection({
                                  id: item.id,
                                  existingItems: initialCollectionItems,
                              })
                            : null
                    }
                />
            </div>
            <div className={style.cardBody}>
                <div className={style.cardNameWrap}>
                    <DotIconsSetCollection
                        contentType={reviseModalType}
                        item={item}
                    />
                    <span className={style.setCardTitle}>
                        {reviseModalType === "collection"
                            ? (item as Flashcard_collection_preview)
                                  .collection_name
                            : (item as Flashcard_set_with_cards).set_name}
                    </span>
                </div>
                <GetCardCount item={item} />
            </div>
        </div>
    );
};

function CollectionAndSetsSelectedObjects() {
    const {
        initialCollectionItems,
        initialSetItems,
        reviseModalType,
        removeFromSet,
        removeFromCollection,
    } = useReviseModal();

    return (
        <>
            {initialCollectionItems &&
                reviseModalType === "collection" &&
                initialCollectionItems.map((item) => {
                    return (
                        <SetCollectionCard
                            key={`${item.id}-revise-modal`}
                            item={item}
                            removeFromSet={removeFromSet}
                            removeFromCollection={removeFromCollection}
                            initialCollectionItems={initialCollectionItems}
                            initialSetItems={initialSetItems}
                            reviseModalType={reviseModalType}
                        />
                    );
                })}
            {initialSetItems &&
                reviseModalType === "set" &&
                initialSetItems.map((item) => {
                    return (
                        <SetCollectionCard
                            key={`${item.id}-revise-modal`}
                            item={item}
                            removeFromSet={removeFromSet}
                            removeFromCollection={removeFromCollection}
                            initialCollectionItems={initialCollectionItems}
                            initialSetItems={initialSetItems}
                            reviseModalType={reviseModalType}
                        />
                    );
                })}
        </>
    );
}

export default CollectionAndSetsSelectedObjects;
