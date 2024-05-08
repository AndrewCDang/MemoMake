"use client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import TickValidate from "@/app/_components/tickValidate/tickValidate";
import { Flashcard_set, Flashcard_set_with_count } from "@/app/_types/types";
import style from "./createCollectionModal.module.scss";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CornerClose from "@/app/_components/cornerClose/cornerClose";
import TextInput from "@/app/_components/textInput/inputField";
import Button from "@/app/_components/(buttons)/styledButton";
import { insertCollection } from "@/app/_actions/insertCollection";
import { toastNotify } from "@/app/(toast)/toast";
import { z } from "zod";
import LabelInput from "@/app/_components/categoryInput/labelInput";

function CreateCollectionModal({
    collectionSet,
    userId,
}: {
    collectionSet: Flashcard_set_with_count[];
    userId: string;
}) {
    const [parent] = useAutoAnimate();

    const [selectedSets, setSelectedSets] = useState<Flashcard_set[]>([]);
    const [searchSetInput, setSearchSetInput] = useState<string>("");

    const setListHandler = (item: Flashcard_set) => {
        if (selectedSets.some((selItem) => item.id === selItem.id)) {
            // Removes set
            setSelectedSets((prevState) => {
                const remainingSets = prevState.filter((prevItem) =>
                    selectedSets.some((selItem) => prevItem.id !== item.id)
                );
                return remainingSets;
            });
        } else {
            setSelectedSets((prevState) => {
                return [...prevState, item];
            });
        }
    };

    // Set Search function
    const searchSetHandler = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchSetInput(e.target.value);
    };

    const filteredList = collectionSet
        .filter((item) =>
            item.set_name
                .toLowerCase()
                .includes(searchSetInput?.toLowerCase() || "")
        )
        .filter((item) => !selectedSets.some((obj) => obj.id === item.id));

    const keydownHandler = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            setSearchSetInput("");
            if (filteredList.length > 0 && filteredList[0]) {
                const suggestedFirstItem = filteredList[0];
                setListHandler(suggestedFirstItem);
            }
        }
    };

    // Creates collection
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [collectionName, setCollectionName] = useState<string>("");
    const [collectionNameErr, setCollectionNameErr] = useState<string | null>(
        null
    );
    const [collectionIdsErr, setCollectionIdsErr] = useState<string | null>(
        null
    );

    const createCollectionSchema = z.object({
        id: z.string(),
        setIds: z.array(z.string()).min(2, {
            message: "Must have more than 1 set inside a collection",
        }),
        name: z
            .string()
            .min(3, {
                message: "Collection name must have at least 3 characters",
            })
            .max(255, {
                message: "Collection name must have less than 255 characters",
            }),
        categories: z.array(z.string()),
    });

    const textInputHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCollectionName(e.target.value);
    };

    // Values for Category Inputs for Collection
    const formRef = useRef(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [typedCategory, setTypedCategory] = useState<string>("");

    const categoryHandler = (arg: string[]) => {};

    // Handler on Submit

    const modalHandler = async (e: FormEvent, extraCategory?: string) => {
        e.preventDefault();
        const setIds = selectedSets.map((item) => {
            return item.id;
        });

        const submittedCollection = {
            name: collectionName,
            setIds: setIds,
            id: userId,
            categories: extraCategory
                ? [...categories, extraCategory]
                : categories,
        };

        const test = createCollectionSchema.safeParse(submittedCollection);
        if (test.success) {
            setIsloading(true);
            const createCollection = await insertCollection(
                submittedCollection
            );
            setIsloading(false);
            toastNotify("Collection Created");
            setCollectionName("");
            setCollectionIdsErr(null);
            setCollectionNameErr(null);
            setCategories([]);
            setSelectedSets([]);
            return;
        }

        const errors = test.error.format();
        if (errors.name) {
            setCollectionNameErr(errors.name._errors[0]);
        }
        if (errors.setIds?._errors) {
            setCollectionIdsErr(errors.setIds._errors[0]);
        }
    };

    // Checks to see if category input has any tpyed(but not inserted) input before submission, if so, inserts the input then submits.
    const preSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        if (typedCategory) {
            modalHandler(e, typedCategory);
            return;
        }
        modalHandler(e);
    };

    return (
        <form
            onSubmit={(e) => preSubmitHandler(e)}
            ref={formRef}
            className={style.modalContainer}
        >
            <div className={style.setCardSection}>
                <TextInput
                    id={"collectionNameInput"}
                    type="text"
                    placeholder={
                        collectionNameErr && collectionName.length <= 3
                            ? collectionNameErr
                            : "Collection Name"
                    }
                    inputValue={collectionName}
                    handler={textInputHandler}
                    error={
                        collectionNameErr !== null && collectionName.length <= 3
                            ? true
                            : false
                    }
                />

                <div ref={parent} className={style.setCardContainer}>
                    {selectedSets.map((item) => {
                        return (
                            <div key={item.id} className={style.setCard}>
                                <CornerClose
                                    cornerSpace="tight"
                                    handler={() => setListHandler(item)}
                                />
                                <div className={style.setCardTitle}>
                                    {item.set_name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <section>
                <section className={style.insertSetWrapper}>
                    <section
                        style={{ overflow: "hidden" }}
                        className={style.insertSetContainer}
                    >
                        <TextInput
                            type="text"
                            id={"otherSets"}
                            placeholder="Search for set in your library"
                            handler={searchSetHandler}
                            keyDownHandler={keydownHandler}
                            inputValue={searchSetInput}
                        />
                        <div className={style.setSuggestionList}>
                            <input
                                className={style.insertSetCheckbox}
                                type="checkbox"
                                defaultChecked={searchSetInput ? true : false}
                            ></input>
                            {filteredList.length > 0 &&
                                filteredList.map((item) => {
                                    return (
                                        <div
                                            onClick={() => setListHandler(item)}
                                            key={item.id}
                                        >
                                            {item.set_name}
                                            <span className={style.itemCount}>
                                                {item.count} card
                                                {item.count > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </section>
            </section>
            {collectionIdsErr && (
                <section className={style.stateCheckValidation}>
                    {selectedSets.length > 1 && (
                        <div>
                            Selected set{selectedSets.length > 1 ? "s" : ""}
                        </div>
                    )}
                    {selectedSets.length <= 1 && (
                        <span>Select more than 1 set</span>
                    )}
                    <TickValidate
                        condition={selectedSets.length > 1 ? true : false}
                    />
                </section>
            )}
            <LabelInput
                formRef={formRef}
                categories={categories}
                setCategories={setCategories}
                categoryHandler={categoryHandler}
                setTypedCategory={setTypedCategory}
            />
            <Button loading={isLoading} text="Create Collection" />
        </form>
    );
}

export default CreateCollectionModal;
