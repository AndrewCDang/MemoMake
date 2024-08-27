import React, { useEffect, useRef, useState } from "react";
import style from "./difficultyBtns.module.scss";
import { CombinedType } from "../../study";
import { motion } from "framer-motion";
import { labelColour } from "@/app/_components/_generalUi/difficultyColours/difficultyColours";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import { updateCard } from "@/app/_actions/updateCard";

function DifficultyBtns({
    item,
    userId,
}: {
    item: CombinedType;
    userId: string | undefined;
}) {
    const [initialDiff, setInitialDiff] = useState<string>(item.difficulty);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const diffArray = ["NA", "EASY", "MEDIUM", "HARD"];
    const popRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (popRef.current && !popRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

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

    useEffect(() => {
        if (popRef.current) {
            window.addEventListener("click", handleClickOutside);

            return () => {
                window.removeEventListener("click", handleClickOutside);
            };
        }
    }, [popRef]);

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
                                        diff.slice(1).toLocaleLowerCase()}{" "}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </PopOverContent>
        </aside>
    );
}

export default DifficultyBtns;
