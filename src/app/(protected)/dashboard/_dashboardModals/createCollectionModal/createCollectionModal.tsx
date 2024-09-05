"use client";
import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import TickValidate from "@/app/_components/tickValidate/tickValidate";
import {
    Flashcard_set,
    Flashcard_set_with_cards,
    Flashcard_set_with_count,
    ThemeColour,
} from "@/app/_types/types";
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
import UploadImage, {
    uploadImageHandler,
} from "@/app/_components/uploadImage/uploadImage";
import { createCollectionSchema } from "./zodSchema/createCollectionSchema";
import { useCreateCollectionModal } from "./useCreateCollection";
import {
    ContentCarouselChild,
    ContentCarouselParent,
} from "@/app/_components/contentCarousel/contentCarousel";
import { updateCollection } from "@/app/_actions/updateCollection";
import { updateCollectionSchema } from "./zodSchema/updateCollectionSchema";

type UpdateCollectionType = {
    name: string;
    collectionId: string;
    setIds: string[];
    categories: string[];
    colours: coloursType | ThemeColour;
    image: string | null;
};

type InsertCollectionType = {
    name: string;
    setIds: string[];
    id: string;
    colours:
        | "red"
        | "blue"
        | "blueSelect"
        | "yellow"
        | "green"
        | "white"
        | "grey"
        | "lightGrey"
        | "black"
        | "purple"
        | null;
    categories: string[];
    image: string | null;
};

function CreateCollectionModal({
    collectionSet,
    userId,
}: {
    collectionSet: Flashcard_set_with_count[];
    userId: string;
}) {
    // Global Modal States
    const { initialSetItems, setInitalSet } = useReviseModal();
    const { hideCreateCollectionModal, isEdit, editedItem } =
        useCreateCollectionModal();
    const [parent] = useAutoAnimate();

    // Setting Iniitial form States
    const [selectedSets, setSelectedSets] = useState<Flashcard_set[]>(
        isEdit ? (editedItem ? editedItem.set_items : []) : []
    );
    const [searchSetInput, setSearchSetInput] = useState<string>("");
    const [selectedColour, setSelectedColour] = useState<
        coloursType | ThemeColour
    >(isEdit ? (editedItem ? editedItem.theme_colour : "white") : "white");
    const [image, setImage] = useState<File | null>();
    const [isLoadingNewItems, setIsLoadingNewItems] = useState<boolean>(false);

    const filteredList = collectionSet
        .filter((item) =>
            item.set_name
                .toLowerCase()
                .includes(searchSetInput?.toLowerCase() || "")
        )
        .filter((item) => !initialSetItems.some((obj) => obj.id === item.id));

    useEffect(() => {
        const selectedSetWithCount = selectedSets.map((item) => {
            const flashcardsNum =
                filteredList[
                    filteredList.findIndex((card) => card.id === item.id)
                ]?.item_count || 0;
            return { ...item, flashcards: Array(flashcardsNum * 1).fill(0) };
        }) as Flashcard_set_with_cards[];
        setInitalSet({ item: selectedSetWithCount });
    }, []);

    // Colour Handler

    const colourSwatchHandler = (id: string, col: coloursType) => {
        setSelectedColour(col);
    };

    // Creates collection
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [collectionName, setCollectionName] = useState<string>(
        isEdit ? (editedItem ? editedItem.collection_name : "") : ""
    );
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
    const [categories, setCategories] = useState<string[]>(
        isEdit ? (editedItem ? editedItem.set_categories : []) : []
    );
    const [typedCategory, setTypedCategory] = useState<string>("");

    const categoryHandler = (arg: string[]) => {};

    // Handler on Submit

    const modalHandler = async (e: FormEvent, extraCategory?: string) => {
        e.preventDefault();
        const setIds = initialSetItems.map((item) => {
            return item.id;
        });

        const uploadImageRetrieveUrl = image
            ? await uploadImageHandler(image)
            : null;

        const url = uploadImageRetrieveUrl ? uploadImageRetrieveUrl.url : null;

        const submittedCollection =
            isEdit && editedItem
                ? {
                      name: collectionName,
                      setIds: setIds,
                      collectionId: editedItem.id,
                      colours: selectedColour,
                      categories: extraCategory
                          ? [...categories, extraCategory]
                          : categories,
                      image: url,
                  }
                : {
                      name: collectionName,
                      setIds: setIds,
                      id: userId,
                      colours: selectedColour,
                      categories: extraCategory
                          ? [...categories, extraCategory]
                          : categories,
                      image: url,
                  };

        const updateOrInsertHandler = async (
            submitCollection: UpdateCollectionType | InsertCollectionType
        ) => {
            if (isEdit) {
                return updateCollection(
                    submitCollection as UpdateCollectionType
                );
            } else {
                return insertCollection(
                    submitCollection as InsertCollectionType
                );
            }
        };

        const test = isEdit
            ? updateCollectionSchema.safeParse(submittedCollection)
            : createCollectionSchema.safeParse(submittedCollection);
        if (test.success) {
            console.log("updating..");
            setIsloading(true);
            await updateOrInsertHandler(submittedCollection);
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
                                    selected={selectedColour || "white"}
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
                        <UploadImage
                            exisitingImage={
                                isEdit && editedItem ? editedItem.image : null
                            }
                            image={image}
                            setImage={setImage}
                        />
                    </div>
                </ContentCarouselChild>
            </ContentCarouselParent>
            <Button
                disabled={isLoading}
                handler={(e) => preSubmitHandler(e)}
                loading={isLoading}
                text={isEdit ? "Confirm Changes" : "Create Collection"}
            />
        </form>
    );
}

export default CreateCollectionModal;
