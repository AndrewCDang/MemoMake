import React, { useState } from "react";
import RecentItemsBtns from "./recentItemsBtns";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import style from "../recentItems.module.scss";
import { colours } from "@/app/styles/colours";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs/svgs";
import { ContentType, Difficulty, Flashcard_set } from "@/app/_types/types";
import { labelColour } from "@/app/_components/_generalUi/difficultyColours/difficultyColours";
import ResultsGraph from "@/app/study/components/resultButtons/components/resultsGraph";
import TickValidate from "@/app/_components/tickValidate/tickValidate";
import CollectionSets from "@/app/_components/setAndCollectionCard/collectionComponents/collectionSetsV2";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { HiChevronRight } from "react-icons/hi2";
import ExpandHeightToggler from "@/app/_components/expandHeightToggler/expandHeightToggler";

type RecentItemsCardTypes = {
    historyItem: {
        content_type: ContentType;
        difficulties: Difficulty[];
        tags: string[];
        content: Flashcard_collection_set_joined[] | Flashcard_set[];
        score: number;
    };
};
function RecentItemsCard({ historyItem }: RecentItemsCardTypes) {
    const getName = (
        item: Flashcard_collection_set_joined | Flashcard_set,
        contentType: ContentType
    ) => {
        if (contentType === "collection") {
            return (item as Flashcard_collection_set_joined).collection_name;
        } else if (contentType === "set") {
            return (item as Flashcard_set).set_name;
        } else return "";
    };

    const id = historyItem.content.flatMap((item) => item.id).join("-");
    const settingBgCol =
        historyItem.content.length === 1
            ? historyItem.content[0].theme_colour
                ? colours[historyItem.content[0].theme_colour](0.1)
                : colours.grey(0.1)
            : colours.grey(0.1);

    const [expandSetting, setExpandSetting] = useState<boolean>(false);

    return (
        <div
            className={style.contentsContainer}
            key={`recent-collection-group}`}
        >
            <section className={style.overlaidCarsContainer}>
                {(historyItem.content as Flashcard_collection_set_joined[]).map(
                    (item) => {
                        const backgroundColour = item.theme_colour
                            ? colours[item.theme_colour]()
                            : colours.grey();
                        return (
                            <section
                                key={`recentCardContainer-${item.id}`}
                                className={style.contentContainer}
                            >
                                <section className={style.contentItem}>
                                    <div
                                        className={style.contentItemBackground}
                                        style={{
                                            backgroundColor: backgroundColour,
                                        }}
                                    ></div>
                                    <div
                                        className={style.iconContainer}
                                        style={{
                                            backgroundColor: backgroundColour,
                                        }}
                                    >
                                        {historyItem.content_type ===
                                        "collection" ? (
                                            <CollectionIcon />
                                        ) : historyItem.content_type ===
                                          "set" ? (
                                            <SetIcon />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    {!item.image && (
                                        <img
                                            className={style.setImage}
                                            src={
                                                item.image || "/defaultImg.jpg"
                                            }
                                            alt={`$${item.collection_name}-image`}
                                        ></img>
                                    )}{" "}
                                    <h6>
                                        {getName(
                                            item,
                                            historyItem.content_type
                                        )}
                                    </h6>
                                </section>
                            </section>
                        );
                    }
                )}
            </section>
            <section
                className={`${style.labelBody} ${
                    historyItem.content.length > 1 ? style.labelBodyGroup : ""
                }`}
            >
                {historyItem.content.length > 1 && (
                    <h6>
                        Multiple {capitaliseFirstChar(historyItem.content_type)}
                        s
                    </h6>
                )}
                <div className={style.bodyInfo}>
                    <div className={style.titleSection}>
                        <div className={style.resultsContainer}>
                            <ResultsGraph
                                progress={historyItem.score}
                                showScore={false}
                                customWidth={48}
                            />
                            <span>{historyItem.score}%</span>
                        </div>
                        {historyItem.content_type === "collection" &&
                            historyItem.content.length === 1 && (
                                <CollectionSets
                                    collectionItem={
                                        historyItem
                                            .content[0] as Flashcard_collection_set_joined
                                    }
                                />
                            )}
                    </div>
                    <section
                        style={{ backgroundColor: settingBgCol }}
                        className={style.settingsContainer}
                    >
                        <button
                            onClick={() =>
                                setExpandSetting((prevState) => !prevState)
                            }
                            className={style.settingToggler}
                        >
                            <span className={style.settingsText}>
                                Last used settings
                            </span>
                            <HiChevronRight />
                        </button>
                        <ExpandHeightToggler isOn={expandSetting}>
                            <div className={style.labelContainer}>
                                {historyItem.difficulties ? (
                                    <div className={style.labelRow}>
                                        {historyItem.difficulties.map(
                                            (diff) => {
                                                return (
                                                    <div
                                                        key={`${id}-diff`}
                                                        className={
                                                            style.diffLabel
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                labelColour(
                                                                    diff
                                                                ),
                                                        }}
                                                    >
                                                        {diff === "NA"
                                                            ? "None"
                                                            : diff}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className={style.defaultSettings}>
                                        <TickValidate condition={true} />
                                        <span>All difficulties</span>
                                    </div>
                                )}
                            </div>
                            <div className={style.labelContainer}>
                                {historyItem.tags ? (
                                    <div className={style.labelRow}>
                                        {historyItem.tags.map((diff, index) => {
                                            return (
                                                <div
                                                    key={`${historyItem.tags[index]}`}
                                                    className={style.tagLabel}
                                                >
                                                    {diff}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={style.defaultSettings}>
                                        <TickValidate condition={true} />
                                        <span>All Tags</span>
                                    </div>
                                )}
                            </div>
                        </ExpandHeightToggler>
                    </section>
                </div>

                <section>
                    <RecentItemsBtns
                        contentType={historyItem.content_type}
                        id={historyItem.content.flatMap((item) => item.id)}
                    />
                </section>
            </section>
        </div>
    );
}

export default RecentItemsCard;
