"use client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import TickValidate from "@/app/_components/tickValidate/tickValidate";
import { Flashcard_set, Flashcard_set_with_count } from "@/app/_types/types";
import style from "./createCollectionModal.module.scss";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import TextInput from "@/app/_components/textInput/inputField";
import Button from "@/app/_components/(buttons)/styledButton";
import { insertCollection } from "@/app/_actions/insertCollection";
import { toastNotify } from "@/app/(toast)/toast";
import { z } from "zod";
import LabelInput from "@/app/_components/categoryInput/labelInput";
import ColourThemeBanner from "../sharedComponents/colourThemeBanner/colourThemeBanner";
import ColourSwatchPicker from "@/app/_components/colourSwatchPicker/colourSwatchPicker";
import { coloursType } from "@/app/styles/colours";
import ListPickerComponent from "@/app/_components/reviseCollection/components/listPickerComponent";
import CollectionAndSetsSelectedObjects from "@/app/_components/reviseCollection/components/collectionAndSetsSelectedObjects";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import UploadImage from "@/app/_components/uploadImage/uploadImage";
import { createCollectionSchema } from "./zodSchema/createCollectionSchema";
import { useCreateCollectionModal } from "./useCreateCollection";
import {
    ContentCarouselChild,
    ContentCarouselParent,
} from "@/app/_components/contentCarousel/contentCarousel";

function CreateCollectionModal({
    collectionSet,
    userId,
}: {
    collectionSet: Flashcard_set_with_count[];
    userId: string;
}) {
    const { initialSetItems, setInitalSet } = useReviseModal();
    const { hideCreateCollectionModal } = useCreateCollectionModal();
    const [parent] = useAutoAnimate();
    const [selectedSets, setSelectedSets] = useState<Flashcard_set[]>([]);
    const [searchSetInput, setSearchSetInput] = useState<string>("");
    const [selectedColour, setSelectedColour] = useState<coloursType>("white");
    const [image, setImage] = useState<File>();

    const filteredList = collectionSet
        .filter((item) =>
            item.set_name
                .toLowerCase()
                .includes(searchSetInput?.toLowerCase() || "")
        )
        .filter((item) => !initialSetItems.some((obj) => obj.id === item.id));

    // Colour Handler

    const colourSwatchHandler = (id: string, col: coloursType) => {
        setSelectedColour(col);
    };

    // Creates collection
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [collectionName, setCollectionName] = useState<string>("");
    const [collectionNameErr, setCollectionNameErr] = useState<string | null>(
        null
    );

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
        const setIds = initialSetItems.map((item) => {
            return item.id;
        });

        const submittedCollection = {
            name: collectionName,
            setIds: setIds,
            id: userId,
            colours: selectedColour,
            categories: extraCategory
                ? [...categories, extraCategory]
                : categories,
        };

        const test = createCollectionSchema.safeParse(submittedCollection);
        if (test.success) {
            setIsloading(true);
            await insertCollection(submittedCollection);
            setIsloading(false);
            toastNotify("Collection Created");
            setCollectionName("");
            setCollectionNameErr(null);
            setCategories([]);
            setSelectedSets([]);
            setInitalSet({ item: [] });
            setSelectedColour("white");
            setTimeout(() => {
                hideCreateCollectionModal();
            }, 500);

            return;
        }

        const errors = test.error.format();
        if (errors.name) {
            setCollectionNameErr(errors.name._errors[0]);
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
            onSubmit={(e) => e.preventDefault()}
            ref={formRef}
            className={style.modalContainer}
        >
            <ColourThemeBanner col={selectedColour} />
            <ContentCarouselParent updateValues={[initialSetItems, categories]}>
                <ContentCarouselChild pageName="Main">
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
                                collectionNameErr !== null &&
                                collectionName.length <= 3
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className={style.selectSetsContainer}>
                        <section className={style.stateCheckValidation}>
                            <label>
                                {initialSetItems.length > 0
                                    ? "Selected Set"
                                    : "Select Sets"}
                                {initialSetItems.length > 1 ? "s" : ""}
                            </label>
                            {initialSetItems.length > 0 && (
                                <TickValidate condition={true} />
                            )}
                        </section>
                        <div ref={parent} className={style.setCardContainer}>
                            <CollectionAndSetsSelectedObjects />
                        </div>
                    </div>
                    <div>
                        {/* Add Set Modal | Text input | Selectable Set List */}
                        <ListPickerComponent
                            searchList={filteredList}
                            addSetModal={true}
                            selectedSets={selectedSets}
                            filteredList={filteredList}
                            contentType={"set"}
                            setFetchLoading={setIsloading}
                            fetchFlashCards={false}
                        />
                    </div>
                </ContentCarouselChild>
                <ContentCarouselChild pageName="Extra">
                    <div className={style.extraDetailsContainer}>
                        <div>
                            <div className={style.colourSwatchWrap}>
                                <label>Set Colour</label>
                                <ColourSwatchPicker
                                    id="id"
                                    selected={selectedColour}
                                    handler={colourSwatchHandler}
                                />
                            </div>
                            <LabelInput
                                formRef={formRef}
                                categories={categories}
                                setCategories={setCategories}
                                categoryHandler={categoryHandler}
                                setTypedCategory={setTypedCategory}
                            />
                        </div>
                        <UploadImage image={image} setImage={setImage} />
                    </div>
                </ContentCarouselChild>
            </ContentCarouselParent>
            <Button
                disabled={isLoading}
                handler={(e) => preSubmitHandler(e)}
                loading={isLoading}
                text="Create Collection"
            />
        </form>
    );
}

export default CreateCollectionModal;
