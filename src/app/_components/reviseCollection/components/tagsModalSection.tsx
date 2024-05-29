import React, { Dispatch, SetStateAction } from "react";
import TickValidate from "../../tickValidate/tickValidate";
import SliderToggle from "../../sliderToggle/sliderToggle";
import ExpandHeightToggler from "../../expandHeightToggler/expandHeightToggler";
import style from "../reviseCards.module.scss";
import CornerClose from "../../cornerClose/cornerClose";

type TagsModalSectionTypes = {
    allTags: boolean;
    selectedTags: string[];
    setAllTags: Dispatch<SetStateAction<boolean>>;
    sliderTagsHandler: () => void;
    selectedTagListHandler: (tag: string) => void;
    availableTags: string[] | undefined;
};

function TagsModalSection({
    allTags,
    setAllTags,
    selectedTags,
    sliderTagsHandler,
    selectedTagListHandler,
    availableTags,
}: TagsModalSectionTypes) {
    return (
        <div>
            <h5 className={style.headingSpacing}>Tags</h5>
            {allTags ? (
                <div className={style.defaultHeadingOption}>
                    <div>
                        Revise <span className={style.underline}>all</span> Tags
                    </div>
                    <TickValidate condition={true} />
                </div>
            ) : (
                <section className={style.stateCheckValidation}>
                    <div>
                        Revise
                        <span className={style.underline}>Selected</span>
                        Tags
                    </div>
                    <TickValidate
                        condition={selectedTags.length > 0 ? true : false}
                    />
                </section>
            )}
            <SliderToggle
                name="allTags"
                setChecked={setAllTags}
                checked={allTags}
                handler={sliderTagsHandler}
                variant="coloured"
            />
            <ExpandHeightToggler isOn={!allTags}>
                <section className={style.tagLabelsContainer}>
                    <div className={style.selectedTagsLabelContainer}>
                        <div className={style.selectedTagsHeader}>
                            <span className={style.labelSubTitle}>
                                Selected Tags
                            </span>
                            {selectedTags.length < 1 && <label>None</label>}
                        </div>
                        <div
                            className={`${style.selectedLabelConatiner} ${style.labelContainer}`}
                        >
                            {selectedTags &&
                                selectedTags.map((tag) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                selectedTagListHandler(tag)
                                            }
                                            className={style.label}
                                            key={tag}
                                        >
                                            {tag}
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
                            Tags Available
                        </span>
                        <div className={style.labelContainer}>
                            {availableTags &&
                                availableTags.map((tag) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                selectedTagListHandler(tag)
                                            }
                                            className={style.label}
                                            key={tag}
                                        >
                                            {tag}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            </ExpandHeightToggler>
        </div>
    );
}

export default TagsModalSection;
