import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "./previewModal.module.scss";
import { Flashcard_set_with_cards } from "@/app/_types/types";
import { colours } from "@/app/styles/colours";
import { SetIcon } from "../svgs";
import { motion } from "framer-motion";
import { MdPlayArrow } from "react-icons/md";
import ExpandHeightToggler from "../expandHeightToggler/expandHeightToggler";

type ToggleType = {
    [key: string]: boolean;
};

type PreviewModalSetType = {
    previewContent: Flashcard_set_with_cards[] | null;
};

function PreviewModalSet({ previewContent }: PreviewModalSetType) {
    const defaultToggle = previewContent
        ? previewContent.reduce((acc, item) => {
              acc[item.id] = true;
              return acc;
          }, {} as ToggleType)
        : {};

    type ToggleType = {
        [key: string]: boolean;
    };
    const [toggledSets, setToggledSets] = useState<ToggleType>(defaultToggle);

    useEffect(() => {
        if (previewContent)
            setToggledSets(
                previewContent.reduce((acc, item) => {
                    acc[item.id] = true;
                    return acc;
                }, {} as ToggleType)
            );
    }, []);

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <>
            {previewContent && (
                <section className={style.setItemsContainer}>
                    {previewContent.map((set) => {
                        return (
                            <section
                                key={set.id}
                                className={style.flashSetContainer}
                            >
                                <button
                                    style={{
                                        backgroundColor:
                                            colours[
                                                set.theme_colour
                                                    ? set.theme_colour
                                                    : "grey"
                                            ](),
                                        borderRadius: !toggledSets[set.id]
                                            ? "0.5rem 0.5rem 0.5rem 0.5rem"
                                            : "0.5rem 0.5rem 0rem 0rem",
                                        transition:
                                            "border-radius 0.2s ease-in-out",
                                    }}
                                    onClick={() =>
                                        setToggledSets({
                                            ...toggledSets,
                                            [set.id]: !toggledSets[set.id],
                                        })
                                    }
                                    className={style.flashSetTitle}
                                >
                                    <div className={style.flashSetTitleLogo}>
                                        <SetIcon />
                                        <h6>{set.set_name}</h6>
                                    </div>
                                    {set.flashcards &&
                                        set.flashcards.length > 0 && (
                                            <motion.div
                                                animate={{
                                                    rotate: toggledSets[set.id]
                                                        ? 90
                                                        : 0,
                                                }}
                                            >
                                                <MdPlayArrow />
                                            </motion.div>
                                        )}
                                </button>
                                {set.flashcards && set.flashcards.length > 0 ? (
                                    <ExpandHeightToggler
                                        isOn={toggledSets[set.id]}
                                        transition={loaded}
                                    >
                                        <section
                                            className={
                                                style.flashCardSetContainer
                                            }
                                        >
                                            <section
                                                className={
                                                    style.flashCardItemHeading
                                                }
                                            >
                                                <div>Question</div>
                                                <div>Answer</div>
                                            </section>
                                            {set.flashcards.map((card) => {
                                                return (
                                                    <section
                                                        key={card.id}
                                                        className={
                                                            style.flashCardItem
                                                        }
                                                    >
                                                        <div>
                                                            {card.item_question}
                                                        </div>
                                                        <div>
                                                            {card.item_answer}
                                                        </div>
                                                    </section>
                                                );
                                            })}
                                        </section>
                                    </ExpandHeightToggler>
                                ) : (
                                    <p>No flashcards made in this set yet</p>
                                )}
                            </section>
                        );
                    })}
                </section>
            )}
        </>
    );
}

export default PreviewModalSet;
