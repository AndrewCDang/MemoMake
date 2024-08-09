"use client";
import React, { useEffect, useRef } from "react";
import style from "./collectionSets.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import PopOverContent from "../../_generalUi/popOverContent/popOverContent";
import { useState } from "react";
import CornerClose from "../../cornerClose/cornerClose";
import { MulitpleSetsIcon, SetIcon } from "../../svgs/svgs";
import { HiChevronRight } from "react-icons/hi2";
import { colours } from "@/app/styles/colours";

type CollectionSetsTypes = {
    collectionItem: Flashcard_collection_set_joined;
};
function CollectionSets({ collectionItem }: CollectionSetsTypes) {
    const showSets = () => {
        alert("hi");
    };
    const popOverRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const [popOverStatus, setpopOverStatus] = useState<boolean>(false);

    const clickToggler = (e: MouseEvent) => {
        if (
            popOverStatus &&
            popOverRef.current &&
            cardRef.current &&
            e.target instanceof Node
        ) {
            if (
                !popOverRef.current.contains(e.target) &&
                !cardRef.current.contains(e.target)
            ) {
                setpopOverStatus(false);
            }
        }
    };

    useEffect(() => {
        if (popOverRef.current) {
            window.addEventListener("click", clickToggler);
            return () => {
                window.removeEventListener("click", clickToggler);
            };
        }
    }, [popOverStatus]);

    const themeSubColour = collectionItem.theme_colour
        ? colours[collectionItem.theme_colour](0.5)
        : colours.grey(0.3);

    return (
        <>
            {collectionItem.set_items.length <= 3 ? (
                <div
                    className={style.setPacks}
                    style={{ backgroundColor: themeSubColour }}
                >
                    {collectionItem.set_items.map((setItem) => {
                        return (
                            <div
                                key={`${setItem.id}-collection-set`}
                                className={style.setName}
                            >
                                <SetIcon />
                                <span>{setItem.set_name}</span>{" "}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <>
                    <div
                        ref={cardRef}
                        className={`${style.setPacks} ${style.morePacks}`}
                        style={{ backgroundColor: themeSubColour }}
                        onClick={() =>
                            setpopOverStatus((prevState) => !prevState)
                        }
                    >
                        {collectionItem.set_items.slice(0, 2).map((setItem) => {
                            return (
                                <div
                                    key={`collectionSet-${collectionItem.id}`}
                                    className={style.setName}
                                >
                                    <SetIcon />
                                    <span>{setItem.set_name}</span>
                                </div>
                            );
                        })}
                        <div
                            className={`${style.setName} ${style.moreSetsContainer}`}
                        >
                            <MulitpleSetsIcon />
                            <span className={style.moreSetsBtn}>
                                +{collectionItem.set_items.length - 2} more sets
                                <HiChevronRight
                                    stroke={colours.black()}
                                    strokeWidth={1}
                                />
                            </span>
                        </div>
                    </div>
                    <PopOverContent
                        isOn={popOverStatus}
                        setIsOn={setpopOverStatus}
                    >
                        <div ref={popOverRef} className={style.setPacksPopover}>
                            {collectionItem.set_items.map((setItem) => {
                                return (
                                    <div
                                        key={`${setItem.id}-collection-set`}
                                        className={style.setName}
                                    >
                                        <SetIcon />
                                        <span>{setItem.set_name}</span>
                                    </div>
                                );
                            })}
                            <CornerClose
                                handler={() => setpopOverStatus(false)}
                            />
                        </div>
                    </PopOverContent>
                </>
            )}
        </>
    );
}

export default CollectionSets;
