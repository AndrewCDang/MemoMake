"use client";
import { Dispatch, SetStateAction, useState } from "react";
import SliderToggle from "../../sliderToggle/sliderToggle";
import TickValidate from "../../tickValidate/tickValidate";
import style from "../reviseCards.module.scss";
import { diffOptions } from "../reviseModalContent";
import ExpandHeightToggler from "../../expandHeightToggler/expandHeightToggler";
import CornerClose from "../../cornerClose/cornerClose";
import { labelColour } from "../../_generalUi/difficultyColours/difficultyColours";

type DifficultyModalTypes = {
    allDiff: boolean;
    selectedDiff: diffOptions[];
    setSelectedDiff: Dispatch<SetStateAction<diffOptions[]>>;
    setAllDiff: Dispatch<SetStateAction<boolean>>;
};

const DifficultyModalSection = ({
    allDiff,
    selectedDiff,
    setSelectedDiff,
    setAllDiff,
}: DifficultyModalTypes) => {
    const sliderDifficultyHandler = () => {
        setAllDiff((prev) => !prev);
    };

    const diffArray: diffOptions[] = ["NA", "EASY", "MEDIUM", "HARD"];

    const selectableDiffArray = diffArray.filter(
        (item) => !selectedDiff.includes(item)
    );

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

    return (
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
                checked={allDiff}
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
                                                selectedDifficultyHandler(item)
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
                                                selectedDifficultyHandler(item)
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
    );
};

export default DifficultyModalSection;
