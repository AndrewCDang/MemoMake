import React from "react";
import { ListItemWithMatch } from "../searchActive";
import {
    ContentType,
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import style from "./searchListItems.module.scss";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs/svgs";
import { colours, coloursType } from "@/app/styles/colours";
import Link from "next/link";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { capitaliseConsecutiveWords } from "@/app/_functions/capitaliseConsecutiveWords";

const splitHighlightText = ({
    searchText,
    name,
}: {
    searchText: string[];
    name: string;
}) => {
    if (searchText.length < 1) return [];
    const nameLower = name.toLowerCase();
    const searchTextLower = searchText.map((item) => item.toLowerCase());

    let splitName = nameLower;

    for (let i = 0; i < searchTextLower.length; i++) {
        const newSplitName = splitName.replace(
            searchTextLower[i],
            `~~§${searchTextLower[i]}~~`
        );
        splitName = newSplitName;
    }
    const nameArray = splitName.split("~~").filter((item) => item !== "");

    // Mapping string array into highlighted/nonhighlted string tsx items
    const mappedArray = nameArray.map((item, index, array) => {
        // '§'indicates the item should be highlighted
        if (item[0] === "§") {
            const word = item.slice(1);
            return (
                <span
                    key={`${item}-${index}-search-item`}
                    style={{ backgroundColor: colours.grey() }}
                    className={style.highlightedText}
                >
                    {/* Capitalises first char of first word in string */}
                    {index === 0 ? (
                        capitaliseFirstChar(word)
                    ) : index > 0 &&
                      // If previous item of the current item in array is an empty string " ", capitalises the curent item
                      array[index - 1][array[index - 1].length - 1] === " " ? (
                        <>{capitaliseConsecutiveWords({ string: word })}</>
                    ) : (
                        word
                    )}
                </span>
            );
        }
        // None highlighted words returned
        return (
            <span key={`${item}-${index}-search-item`}>
                {/* Due to html tags not displaying spaces, will need to manually add  &nbsp; spaces in */}
                {/* Checks if first char has space */}
                {item[0] === " " ? (
                    <>
                        &nbsp;
                        {capitaliseConsecutiveWords({
                            string: item.slice(1),
                        })}
                    </>
                ) : (
                    // Word might be partly highlight/ partly non-highlighted, in these cases the first character (none-highlighted joined word) should not be uppercased.
                    <span>
                        {capitaliseConsecutiveWords({
                            string: item,
                            firstWord: false,
                        })}
                    </span>
                )}
            </span>
        );
    });

    return mappedArray;
};

const SearchListName = ({
    type,
    colour,
    name,
    searchText = [],
}: {
    type: ContentType;
    colour: coloursType;
    name: string;
    searchText: string[];
}) => {
    const props = { name: name, searchText: searchText };

    return (
        <div className={style.collectionName}>
            {type === "collection" && <CollectionIcon />}
            {type === "set" && <SetIcon />}
            <div
                style={{
                    backgroundColor: colours[colour](),
                }}
                className={style.colourIcon}
            ></div>
            <div className={style.spanName}>
                {splitHighlightText(props).map((item) => item)}
            </div>
        </div>
    );
};

const SearchListCount = ({
    type,
    setCount = 0,
    cardCount,
}: {
    type: ContentType;
    setCount?: number;
    cardCount: number;
}) => {
    return (
        <div className={style.countGroup}>
            {type === "collection" && (
                <label>
                    <span>{setCount}</span>{" "}
                    <span>set{setCount * 1 === 1 ? "" : "s"}</span>
                </label>
            )}
            <label>
                <span>{cardCount}</span>{" "}
                <span>total card{cardCount * 1 === 1 ? "" : "s"}</span>
            </label>
        </div>
    );
};

export function SearchCollectionItem({
    searchText,
    collection,
}: {
    searchText: string[] | null;
    collection: ListItemWithMatch<Flashcard_collection_with_count>;
}) {
    return (
        <li className={style.collectionItem}>
            <Link href={`/dashboard/edit/${collection.id}`}>
                <SearchListName
                    type="collection"
                    colour={collection.theme_colour || "grey"}
                    name={capitaliseConsecutiveWords({
                        string: collection.collection_name,
                    })}
                    searchText={searchText || []}
                />
                <SearchListCount
                    type="collection"
                    setCount={collection.set_count}
                    cardCount={collection.item_count}
                />
            </Link>
        </li>
    );
}

export function SearchSetItem({
    searchText,
    set,
}: {
    searchText: string[] | null;
    set: ListItemWithMatch<Flashcard_set_with_count>;
}) {
    return (
        <li className={style.setItem}>
            <Link href={`/dashboard/edit/${set.id}`}>
                <SearchListName
                    type="set"
                    colour={set.theme_colour || "grey"}
                    name={capitaliseConsecutiveWords({ string: set.set_name })}
                    searchText={searchText || []}
                />
                <SearchListCount type="set" cardCount={set.item_count} />
            </Link>
        </li>
    );
}
