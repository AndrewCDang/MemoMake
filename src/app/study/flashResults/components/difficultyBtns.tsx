import React, { useEffect, useRef, useState } from "react";
import style from "./difficultyBtns.module.scss";
import { CombinedType } from "../../study";
import { motion } from "framer-motion";
import { labelColour } from "@/app/_components/_generalUi/difficultyColours/difficultyColours";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import { updateCard } from "@/app/_actions/updateCard";
import {
    Flashcard_collection_with_cards,
    Flashcard_set_with_cards,
} from "@/app/_types/types";

function DifficultyBtns({
    data,
    item,
    userId,
}: {
    data: Flashcard_collection_with_cards[] | Flashcard_set_with_cards[];
    item: CombinedType;
    userId: string | undefined;
}) {
    const [initialDiff, setInitialDiff] = useState<string>(item.difficulty);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const diffArray = ["NA", "EASY", "MEDIUM", "HARD"];
    const setId = data[0]?.user_id;

    const openHandler = () => {
        setIsOpen((prevState) => !prevState);
    };

    const handleDiffUpdate = async (diff: string) => {
        setInitialDiff(diff);
        await updateCard({
            id: item.id,
            setId: item.set_id,
            object: "difficulty",
            value: diff,
        });
    };

    return (
        <aside className={style.difficultyBtns}>
            <div className={style.labelWrap}>
                <div
                    style={{
                        backgroundColor: labelColour(initialDiff),
                    }}
                    className={style.difficultyLabelValue}
                    onClick={openHandler}
                >
                    {initialDiff[0]}
                </div>
            </div>

            {userId === setId && (
                <PopOverContent isOn={isOpen} setIsOn={setIsOpen}>
                    <div className={style.otherDiffSelection}>
                        {diffArray.map((diff, index) => {
                            if (diff === initialDiff) {
                                return null;
                            }

                            return (
                                <motion.div key={diff} layout="position">
                                    <button
                                        style={{
                                            backgroundColor: labelColour(diff),
                                        }}
                                        className={style.difficultyLabelValue}
                                        onClick={() => handleDiffUpdate(diff)}
                                    >
                                        {diff[0] +
                                            diff
                                                .slice(1)
                                                .toLocaleLowerCase()}{" "}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </PopOverContent>
            )}
        </aside>
    );
}

export default DifficultyBtns;
