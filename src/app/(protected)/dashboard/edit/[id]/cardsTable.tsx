"use client";
import React, { useState, useRef, useEffect } from "react";
import { Flashcard_item } from "@/app/_types/types";
import style from "./cardsTable.module.scss";
import { motion } from "framer-motion";
import Checkbox from "@/app/_components/checkbox/checkbox";
import { colours } from "@/app/styles/colours";
import { HiMiniTrash } from "react-icons/hi2";
import { delCard } from "@/app/_actions/delCard";
import { updateCard, UpdateCardTypes } from "@/app/_actions/updateCard";
import { ColumnName, ColsWidthType, Refs, InputValues } from "./cardTableTypes";
import GenericTableItem from "./(components)/tableItems/genericTableItem";
import TagsTableItem from "./(components)/tableItems/tagsTableItem";
import LastModifiedTableItem from "./(components)/tableItems/lastModifiedTableItem";
import DifficultyTableItem, {
    diffArray,
} from "./(components)/tableItems/difficultyTableItem";
import TableHeader from "./tableHeader";
import ApppliedFilters from "./apppliedFilters";
import TableShadow from "./(components)/shadowComponent/tableShadow";
import { formatDate } from "@/app/_functions/formatDate";

// Type of Card Object
type CardTableTypes = {
    cardCollection: Flashcard_item[];
    tagArray: string[];
};

function CardsTable({ cardCollection, tagArray }: CardTableTypes) {
    /**
     Setting Filtered States for hidden columns, tags, difficulty
     */

    //States for heading filter tag_items
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [selectableTagsArray, setSelectableTagsArray] = useState<
        string[] | null
    >(null);

    // States for heading difficulty items
    const [filteredDiff, setFilteredDiff] = useState<string[]>([]);

    // States for handling hidden columns
    const [hiddenColumns, setHiddenColumns] = useState<ColumnName[]>([]);

    // Filtering Card collection of filtered states present
    const filterCardCollection = () => {
        const filterByTag = (collection: Flashcard_item[]) => {
            return collection.filter((card) => {
                return card.item_tags.some((tag) => filteredTags.includes(tag));
            });
        };

        const filterByDiff = (collection: Flashcard_item[]) => {
            return collection.filter((card) => {
                return filteredDiff.includes(card.difficulty);
            });
        };

        let displayCollection = cardCollection;
        if (filteredTags.length > 0) {
            const filterCollectionByTags = filterByTag(displayCollection);
            displayCollection = filterCollectionByTags;
        }
        if (filteredDiff.length > 0) {
            const filterCollectionByTags = filterByDiff(displayCollection);
            displayCollection = filterCollectionByTags;
        }
        return displayCollection;
    };

    const displayCardCollection =
        filteredTags.length > 0 || filteredDiff.length > 0
            ? filterCardCollection()
            : cardCollection;

    const cardsCount = displayCardCollection.length;
    /**
     // Resizable columns logic --
     */
    const headingRef = useRef<HTMLTableSectionElement>(null);

    const cols: ColumnName[] = [
        "item_question",
        "item_answer",
        "item_tags",
        "difficulty",
        "last_modified",
    ];

    const defaultWidths: ColsWidthType = {
        item_question: 184,
        item_answer: 184,
        item_tags: 80,
        difficulty: 80,
        last_modified: 80,
    };

    const [colsWidth, setColWidths] = useState<ColsWidthType>(defaultWidths);
    const [columns, setColumns] = useState(cols);
    const [prevColumns, setPrevColumns] = useState(columns); //tracks previous state, so can determine if change in columns is additive/subtactive/reordered
    const isMouseDownRef = useRef<boolean>(false);
    const targetSlideHeading = useRef<ColumnName | null>(null);
    const initialXRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLTableElement>(null);
    const [extraWidth, setExtraWidth] = useState<number>(0);

    // On document mount, or hidden columns, measure extra remaining spaces(if any) to be shared between columns
    useEffect(() => {
        if (containerRef.current && containerWrapRef.current) {
            const wrapRef = containerWrapRef.current.offsetWidth - 7 * 16;
            console.log(wrapRef);
            const windowWidth = window.innerWidth;
            if (windowWidth < 600) return;

            const previousWidthsSum = Object.values(colsWidth).reduce(
                (acc, curr) => acc + curr,
                0
            );

            // + Spreading extra column spaces for remaining columns
            if (columns.length > prevColumns.length) {
                console.log("added!");
                const addedColumn = columns.filter(
                    (item) => !prevColumns.includes(item)
                )[0];

                const addedColWidth =
                    defaultWidths[addedColumn as ColumnName] || 0;

                100 - 30 > 90;
                const columnWidths = (
                    subtractedWidth: number,
                    columnObjects: ColsWidthType,
                    iterationCount: number,
                    excludedColumns: ColumnName[]
                ): ColsWidthType => {
                    let remainderTotal = 0;
                    let newExcludedColumns: ColumnName[] = [...excludedColumns];
                    const totalColumns = Object.keys(columnObjects).length;
                    const visibleColumns =
                        totalColumns - excludedColumns.length;

                    const columnWidthObjects = Object.entries(columnObjects)
                        .map(([key, value], index, array) => {
                            if (excludedColumns.includes(key as ColumnName)) {
                                return [
                                    key as ColumnName,
                                    defaultWidths[key as ColumnName],
                                ];
                            } else if (
                                value - subtractedWidth / visibleColumns <
                                defaultWidths[key as ColumnName]
                            ) {
                                if (
                                    !hiddenColumns.includes(
                                        key as ColumnName
                                    ) &&
                                    key !== addedColumn
                                ) {
                                    const remainder =
                                        subtractedWidth / visibleColumns -
                                        (value -
                                            defaultWidths[key as ColumnName]);
                                    remainderTotal += remainder;
                                    newExcludedColumns.push(key as ColumnName);
                                }
                                return [
                                    key as ColumnName,
                                    defaultWidths[key as ColumnName],
                                ];
                            } else {
                                return [
                                    key as ColumnName,
                                    key !== addedColumn
                                        ? value -
                                          subtractedWidth / visibleColumns
                                        : defaultWidths[key as ColumnName],
                                ];
                            }
                        })
                        .reduce(
                            (acc, [key, value]) => ({
                                ...acc,
                                [key]: value,
                            }),
                            {}
                        ) as ColsWidthType;

                    if (remainderTotal > 0 && iterationCount < 1) {
                        return columnWidths(
                            remainderTotal,
                            columnWidthObjects,
                            iterationCount + 1,
                            newExcludedColumns
                        );
                    } else {
                        return columnWidthObjects;
                    }
                };

                setColWidths(
                    columnWidths(addedColWidth, colsWidth, 0, [addedColumn])
                );
                // setColWidths(getNewWidths(dividedColWidth));
            }

            // - Subtracting existing column space, to make room for added column
            if (columns.length < prevColumns.length) {
                const currentRemainingWidths = Object.entries(colsWidth)
                    .filter(
                        ([key, value]) =>
                            !hiddenColumns.includes(key as ColumnName)
                    )
                    .reduce((acc, [key, value]) => acc + value, 0);

                if (currentRemainingWidths < wrapRef) {
                    const extraWidths =
                        (wrapRef - currentRemainingWidths) / columns.length;
                    console.log(extraWidth);
                    setColWidths(
                        (prev) =>
                            Object.entries(colsWidth).reduce(
                                (acc, [key, value]) => ({
                                    ...acc,
                                    [key]: !hiddenColumns.includes(
                                        key as ColumnName
                                    )
                                        ? value + extraWidths
                                        : defaultWidths[key as ColumnName],
                                }),
                                {}
                            ) as ColsWidthType
                    );
                }
            }
            // No change in column widths, just shifting order of column
            if (columns.length === prevColumns.length) {
                console.log("shift!");
                const sharedWidths =
                    (wrapRef - previousWidthsSum) / columns.length;
                setColWidths(
                    (prevColWidths) =>
                        Object.entries(colsWidth).reduce(
                            (acc, [key, value]) => ({
                                ...acc,
                                [key]: value + sharedWidths,
                            }),
                            {}
                        ) as ColsWidthType
                );
            }
            setPrevColumns(columns);
        }
    }, [containerRef, columns, hiddenColumns]);

    // 1) Tracks initial x position and allows movemouse logic
    const headingDownHandler = (e: MouseEvent) => {
        e.preventDefault();
        setTimeout(() => {
            isMouseDownRef.current = true;
            initialXRef.current = e.clientX;
        }, 0);
    };

    // 2) whilst mousemove is allowed, it continually updates the state of the colwidth with respect with the x-direction cursor movement
    const headingMoveHandler = (e: MouseEvent) => {
        if (
            isMouseDownRef.current === true &&
            initialXRef.current &&
            targetSlideHeading.current !== null
        ) {
            const differenceX = e.clientX - initialXRef.current;
            const targetHeading = targetSlideHeading.current as ColumnName;
            setColWidths((prevState) => {
                return {
                    ...prevState,
                    [targetHeading]:
                        (prevState[targetHeading] as number) + differenceX,
                };
            });
            initialXRef.current = e.clientX;
        }
    };

    // 3) Resets fields

    const headingUpHandler = (e: MouseEvent) => {
        isMouseDownRef.current = false;
        targetSlideHeading.current = null;
        initialXRef.current = null;
    };

    useEffect(() => {
        if (headingRef.current) {
            headingRef.current.addEventListener(
                "mousedown",
                headingDownHandler
            );
            document.addEventListener("mousemove", headingMoveHandler);
            document.addEventListener("mouseup", headingUpHandler);
            return () => {
                if (headingRef.current) {
                    headingRef.current.removeEventListener(
                        "mousedown",
                        headingDownHandler
                    );
                    document.removeEventListener(
                        "mousemove",
                        headingMoveHandler
                    );
                    document.removeEventListener("mouseup", headingUpHandler);
                }
            };
        }
    }, [headingRef]);

    const [selItems, setSelItems] = useState<string[]>([]);

    const selHandler = (id: string) => {
        if (selItems.includes(id)) {
            setSelItems((prevState) => {
                const filteredArray = prevState.filter((item) => {
                    return item !== id;
                });
                return filteredArray;
            });
        } else {
            setSelItems((prevState) => {
                return [...prevState, id];
            });
        }
    };

    // Handles loading state during item deletion
    const [selDeleting, setSelDeleting] = useState<string[]>([]);

    const delRowHandler = async (id: string) => {
        try {
            let selectedItems = selItems;
            if (!selectedItems.includes(id)) {
                selectedItems.push(id);
                setSelDeleting(selectedItems);
                await delCard(selectedItems);
                setSelDeleting([]);
            } else {
                setSelDeleting(selectedItems);
                await delCard(selItems);
                setSelDeleting([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Placing initial/existing values into input edit field

    const defaultInputValues = cardCollection
        .map((card) => {
            const arrayObjects = columns.reduce((acc, item) => {
                const itemValue =
                    item !== "last_modified"
                        ? card[item]
                        : formatDate(card.last_modified);
                acc[`${item}~${card.id}`] = itemValue;
                return acc;
            }, {} as { [key: string]: string | string[] | undefined });
            return arrayObjects;
        })
        .reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});

    const [inputValues, setInputValues] =
        useState<InputValues>(defaultInputValues);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        itemKey: string
    ) => {
        const newValue = e.target.value;
        setInputValues((prev) => ({ ...prev, [itemKey]: newValue }));
    };

    const handleValueChange = (value: string | string[], itemKey: string) => {
        const newValue = value;
        setInputValues((prev) => ({ ...prev, [itemKey]: newValue }));
    };

    // Input ref in popover component used to change values of table items
    const itemEditRef = useRef<
        Refs<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>
    >({});

    // PopToggler Ref
    const itemLabelRef = useRef<Refs<HTMLInputElement>>({});

    // Table value ref - displayed value of table item
    const tableItemRef = useRef<Refs<HTMLElement>>({});

    // Text Input Ref (used to focus on HTML input object upon popover initialisation)
    const editInputRef = useRef<Refs<HTMLInputElement | HTMLTextAreaElement>>(
        {}
    );

    const [focusedLabel, setFocusedLabel] = useState<string | null>(null);

    // Executes when poptoggler state is switched to true
    const labelItemEditHandler = (key: string) => {
        if (itemEditRef.current[key]) {
            setFocusedLabel(key);

            // If popover element has text input field...
            setTimeout(() => {
                const input = editInputRef.current[key];
                if (input) {
                    input.focus();

                    // Trick to move cursor to the end
                    if (input.tagName === "TEXTAREA") {
                        const textarea = input as HTMLTextAreaElement;
                        const value = textarea.value;
                        textarea.value = "";
                        textarea.value = value;
                    }
                }
            }, 0);
        }
    };

    // Function that checks if data has changed after popover component has been toggled off

    // arrays comparison for tag items
    const compareArrays = (a: string[], b: string[]) => {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    const checkUpdate = async () => {
        if (focusedLabel) {
            const value = inputValues[focusedLabel] || null;
            const id = focusedLabel.split("~")[1];
            const object = focusedLabel.split("~")[0] as ColumnName;
            const foundObject = cardCollection.find(
                (obj) => obj.id === id
            ) as Flashcard_item;
            const existingValue = foundObject[object];
            const isArray = Array.isArray(value);
            if (isArray) {
                const comparisonIsTrue = compareArrays(
                    existingValue as string[],
                    value
                );
                if (comparisonIsTrue) return;
            }
            console.log(value);
            console.log(existingValue);

            if (value !== existingValue) {
                console.log(`
                    id:${id}
                    object:${object}
                    value:${value}
                `);
                try {
                    const updateItem = await updateCard({
                        id: id,
                        object: object,
                        value: value || null,
                    });
                    console.log(updateItem.message);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    // Toggles off popover component
    const labelEditOffClick = async (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (
            focusedLabel &&
            itemLabelRef.current[focusedLabel] &&
            itemEditRef.current[focusedLabel] &&
            tableItemRef.current[focusedLabel] &&
            !itemEditRef.current[focusedLabel].contains(target)
        ) {
            const input = itemEditRef.current[focusedLabel];
            if (input.tagName === "TEXTAREA") {
                const textarea = input as HTMLTextAreaElement;
                if (textarea.value) {
                    tableItemRef.current[focusedLabel].innerHTML =
                        textarea.value;
                }
                textarea.value = "";
            }

            checkUpdate();
            setFocusedLabel(null);
            itemLabelRef.current[focusedLabel].checked = false;
        }
    };

    // Toggles off on enter click
    const labelEditEnterHandler = async (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: ColumnName,
        id: string
    ) => {
        if (
            focusedLabel &&
            itemLabelRef.current[focusedLabel] &&
            itemEditRef.current[focusedLabel] &&
            tableItemRef.current[focusedLabel] &&
            e.key === "Enter"
        ) {
            const returnFunction = () => {
                if (itemLabelRef.current[focusedLabel]) {
                    itemLabelRef.current[focusedLabel].checked = false;
                    setFocusedLabel(null);
                }
            };
            const input = itemEditRef.current[focusedLabel];
            if (input.tagName === "TEXTAREA") {
                const textarea = input as HTMLTextAreaElement;
                if (
                    textarea.value.trim() ===
                    tableItemRef.current[focusedLabel].innerText.trim()
                ) {
                    returnFunction();
                    return;
                }

                if (textarea.value) {
                    tableItemRef.current[focusedLabel].innerHTML =
                        textarea.value;
                }
                const value = textarea.value;
                checkUpdate();
                returnFunction();
            }
        }
    };

    // Adding event listener enabling closure of popover compoennts on off-click
    useEffect(() => {
        if (cardCollection.length > 0) {
            document.addEventListener("click", labelEditOffClick);

            return () => {
                document.removeEventListener("click", labelEditOffClick);
            };
        }
    }, [cardCollection, focusedLabel, inputValues]);

    // Updates items on blur, entered(keydown) cancels this due to focus label being null
    const updateCardHandler = async ({
        id,
        object,
        value,
    }: UpdateCardTypes) => {
        if (
            focusedLabel &&
            itemLabelRef.current[focusedLabel] &&
            tableItemRef.current[focusedLabel] &&
            (value as string).trim() !=
                tableItemRef.current[focusedLabel].innerText.trim()
        ) {
            console.log("Card Updating");
            const updateItem = await updateCard({ id, object, value });
            console.log(updateItem.message);
        }
    };

    // Shadow at bottom/top fading in out on scroll y position
    const containerWrapRef = useRef<HTMLElement>(null);

    if (displayCardCollection.length > 0 && cardCollection) {
        return (
            <main
                className={style.tableContainerWrapper}
                ref={containerWrapRef}
            >
                {/* Displaying current toggled filters */}
                <ApppliedFilters
                    filteredDiff={filteredDiff}
                    setFilteredDiff={setFilteredDiff}
                    filteredTags={filteredTags}
                    setFilteredTags={setFilteredTags}
                    hiddenColumns={hiddenColumns}
                    setColumns={setColumns}
                    setHiddenColumns={setHiddenColumns}
                    setSelectableTagsArray={setSelectableTagsArray}
                    tagArray={tagArray}
                />
                {/* Table */}
                <motion.table
                    className={style.tableContainer}
                    ref={containerRef}
                    layout="position"
                >
                    <TableHeader
                        headingRef={headingRef}
                        columns={columns}
                        setColumns={setColumns}
                        colsWidth={colsWidth}
                        targetSlideHeading={targetSlideHeading}
                        tagArray={tagArray}
                        setFilteredTags={setFilteredTags}
                        filteredTags={filteredTags}
                        selectableTagsArray={selectableTagsArray}
                        setSelectableTagsArray={setSelectableTagsArray}
                        filteredDiff={filteredDiff}
                        setFilteredDiff={setFilteredDiff}
                        setHiddenColumns={setHiddenColumns}
                        hiddenColumns={hiddenColumns}
                    />
                    <tbody className={style.tbody}>
                        {displayCardCollection &&
                            displayCardCollection.map((card, index) => (
                                <tr
                                    style={{
                                        opacity: selDeleting.includes(card.id)
                                            ? 0.3
                                            : 1,
                                        transition: "opacity 0.12s ease-in-out",
                                    }}
                                    key={`${card.id}-tr-${index}`}
                                    className={style.tableRow}
                                >
                                    <td className={style.rowSideBtns}>
                                        <aside className={style.rowAction}>
                                            <div className={style.rowActionRel}>
                                                <div
                                                    onClick={() =>
                                                        delRowHandler(card.id)
                                                    }
                                                    className={
                                                        style.rowActionPopOver
                                                    }
                                                >
                                                    <HiMiniTrash />
                                                </div>
                                            </div>
                                        </aside>
                                        <div
                                            style={{
                                                backgroundColor:
                                                    selItems.includes(card.id)
                                                        ? colours.grey(0.2)
                                                        : "",
                                            }}
                                            className={style.selCol}
                                        >
                                            <Checkbox
                                                id={card.id}
                                                handler={selHandler}
                                            />
                                        </div>
                                    </td>
                                    {columns.map((item) => {
                                        // Column Item Types
                                        const isQuestionOrAnswer = [
                                            "item_question",
                                            "item_answer",
                                        ].includes(item);

                                        const isTags = ["item_tags"].includes(
                                            item
                                        );

                                        const isDifficulty = [
                                            "difficulty",
                                        ].includes(item);

                                        const isLastModified = [
                                            "last_modified",
                                        ].includes(item);

                                        return (
                                            <td
                                                key={`${card.id}-${index}-${item}`}
                                                style={{
                                                    width: `${colsWidth[item]}px`,
                                                    backgroundColor:
                                                        selItems.includes(
                                                            card.id
                                                        )
                                                            ? colours.grey(0.2)
                                                            : "",
                                                }}
                                                className={` ${style.tableItem} ${style.tableItemRel}`}
                                            >
                                                <label
                                                    className={
                                                        style.tableItemLabel
                                                    }
                                                    key={`${item}-${card.id}`}
                                                    htmlFor={`${item}-${card.id}-input`}
                                                ></label>
                                                {/* Table item -  Generic string output */}
                                                {isQuestionOrAnswer && (
                                                    <GenericTableItem
                                                        item={item}
                                                        tableItemRef={
                                                            tableItemRef
                                                        }
                                                        card={card}
                                                        itemEditRef={
                                                            itemEditRef
                                                        }
                                                        inputValues={
                                                            inputValues
                                                        }
                                                        handleInputChange={
                                                            handleInputChange
                                                        }
                                                        labelEditEnterHandler={
                                                            labelEditEnterHandler
                                                        }
                                                        updateCardHandler={
                                                            updateCardHandler
                                                        }
                                                        editInputRef={
                                                            editInputRef
                                                        }
                                                        // Props for PopOver Toggler (Invisible)
                                                        labelItemEditHandler={
                                                            labelItemEditHandler
                                                        }
                                                        itemLabelRef={
                                                            itemLabelRef
                                                        }
                                                    />
                                                )}
                                                {isTags && (
                                                    <TagsTableItem
                                                        item={item}
                                                        tableItemRef={
                                                            tableItemRef
                                                        }
                                                        card={card}
                                                        itemEditRef={
                                                            itemEditRef
                                                        }
                                                        inputValues={
                                                            inputValues
                                                        }
                                                        handleInputChange={
                                                            handleInputChange
                                                        }
                                                        labelEditEnterHandler={
                                                            labelEditEnterHandler
                                                        }
                                                        updateCardHandler={
                                                            updateCardHandler
                                                        }
                                                        editInputRef={
                                                            editInputRef
                                                        }
                                                        // Props for PopOver Toggler (Invisible)
                                                        labelItemEditHandler={
                                                            labelItemEditHandler
                                                        }
                                                        itemLabelRef={
                                                            itemLabelRef
                                                        }
                                                        handleValueChange={
                                                            handleValueChange
                                                        }
                                                    />
                                                )}
                                                {isDifficulty && (
                                                    <DifficultyTableItem
                                                        item={item}
                                                        tableItemRef={
                                                            tableItemRef
                                                        }
                                                        card={card}
                                                        itemEditRef={
                                                            itemEditRef
                                                        }
                                                        inputValues={
                                                            inputValues
                                                        }
                                                        // Props for PopOver Toggler (Invisible)
                                                        labelItemEditHandler={
                                                            labelItemEditHandler
                                                        }
                                                        itemLabelRef={
                                                            itemLabelRef
                                                        }
                                                        handleValueChange={
                                                            handleValueChange
                                                        }
                                                    />
                                                )}
                                                {isLastModified && (
                                                    <LastModifiedTableItem
                                                        card={card}
                                                        item={item}
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                    </tbody>
                </motion.table>
                <TableShadow targetRef={containerRef} cardsCount={cardsCount} />
            </main>
        );
    }
}

export default CardsTable;
