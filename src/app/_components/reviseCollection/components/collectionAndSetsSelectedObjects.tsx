"use client";
import React, { ReactNode } from "react";
import { useReviseModal } from "../useReviseModal";
import CornerClose from "../../cornerClose/cornerClose";
import style from "../reviseCards.module.scss";
import ThemeColourStrip from "../../_generalUi/themeColourStrip/themeColourStrip";
import Image from "next/image";
import { colours } from "@/app/styles/colours";
import { clipPath } from "../../_generalUi/clipPath/clipPath";
import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";

function CollectionAndSetsSelectedObjects() {
    const {
        initialCollectionItems,
        initialSetItems,
        reviseModalType,
        removeFromCollection,
        removeFromSet,
    } = useReviseModal();

    const SetDotIcons = ({ item }: { item: Flashcard_collection_preview }) => {
        return (
            <div>
                {item.sets.slice(0, 10).map((card) => {
                    return (
                        <div
                            key={`${card.id}-dot-set`}
                            style={{
                                backgroundColor:
                                    colours[card.theme_colour || "grey"](),
                            }}
                            className={
                                item.sets.length < 4
                                    ? style.setIcons
                                    : style.setIconsSm
                            }
                        ></div>
                    );
                })}
            </div>
        );
    };

    const GetCardCount = ({
        item,
    }: {
        item: Flashcard_collection_preview | Flashcard_set_with_cards;
    }) => {
        const CardTemplate = ({ number }: { number: number }) => {
            return (
                <span className={style.totalCards}>
                    <span className={style.bold}>{number}</span> cards
                </span>
            );
        };
        if ("collection_name" in item) {
            const cardCount = item.sets
                .flatMap((item) =>
                    item.flashcards ? item.flashcards.length : 0
                )
                .reduce((acc, curr) => acc + curr, 0);

            return <CardTemplate number={cardCount} />;
        } else if ("set_name" in item) {
            const cardCount =
                item && item.flashcards ? item.flashcards.length : 0;
            return <CardTemplate number={cardCount} />;
        }
    };

    return (
        <>
            {initialCollectionItems &&
                reviseModalType === "collection" &&
                initialCollectionItems.map((item) => {
                    return (
                        <div key={item.id} className={style.setCard}>
                            <div className={style.setCardBanner}>
                                <div
                                    style={{
                                        clipPath: clipPath({ scale: 0.4 }),
                                        height: "1.25rem",
                                    }}
                                    className={style.stripContainer}
                                >
                                    <ThemeColourStrip
                                        colour={item.theme_colour || "grey"}
                                        type={1.25}
                                        radius={false}
                                    />
                                </div>
                                <CornerClose
                                    type="circleCorner"
                                    cornerSpace="tight"
                                    handler={() =>
                                        removeFromCollection({
                                            id: item.id,
                                            existingItems:
                                                initialCollectionItems,
                                        })
                                    }
                                />
                            </div>
                            <div
                                style={{
                                    backgroundColor:
                                        colours[item.theme_colour || "grey"](
                                            0.2
                                        ),
                                }}
                                className={style.cardBody}
                            >
                                <span className={style.setCardTitle}>
                                    {item.collection_name}
                                </span>
                                {reviseModalType === "collection" && (
                                    <SetDotIcons item={item} />
                                )}
                                <GetCardCount item={item} />
                            </div>
                            <div
                                style={{
                                    clipPath: clipPath({ scale: 0.4 }),
                                }}
                                className={style.cardBg}
                            ></div>
                        </div>
                    );
                })}
            {initialSetItems &&
                reviseModalType === "set" &&
                initialSetItems.map((item) => {
                    return (
                        <div
                            key={`${item.id}-revise-modal`}
                            className={style.setCard}
                        >
                            <div className={style.setCardBanner}>
                                <div
                                    style={{
                                        clipPath: clipPath({ scale: 0.4 }),
                                        height: "1.25rem",
                                    }}
                                    className={style.stripContainer}
                                >
                                    <ThemeColourStrip
                                        colour={item.theme_colour || "grey"}
                                        type={1.25}
                                        radius={false}
                                    />
                                </div>
                                <CornerClose
                                    type="circleCorner"
                                    cornerSpace="tight"
                                    handler={() =>
                                        removeFromSet({
                                            id: item.id,
                                            existingItems: initialSetItems,
                                        })
                                    }
                                />
                            </div>
                            <div
                                style={{
                                    backgroundColor:
                                        colours[item.theme_colour || "grey"](
                                            0.2
                                        ),
                                }}
                                className={style.cardBody}
                            >
                                <span className={style.setCardTitle}>
                                    {item.set_name}
                                </span>
                                <GetCardCount item={item} />
                            </div>
                        </div>
                    );
                })}
        </>
    );
}

export default CollectionAndSetsSelectedObjects;
