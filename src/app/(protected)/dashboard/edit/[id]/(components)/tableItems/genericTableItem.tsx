"use client";
import React, { MutableRefObject, useEffect, useState } from "react";
import { ColumnName, Refs, InputValues } from "../cardTableTypes";
import { UpdateCardTypes } from "@/app/_actions/updateCard";
import style from "../cardsTable.module.scss";
import { Flashcard_item } from "@/app/_types/types";
import ReactTextareaAutosize from "react-textarea-autosize";
import PopToggler from "./popToggler";
import UploadImage from "@/app/_components/uploadImage/uploadImage";
import { FaImage } from "react-icons/fa6";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiArrowUturnLeft } from "react-icons/hi2";
import ButtonWrap from "@/app/_components/(buttons)/buttonWrap";
import { uploadImageHandler } from "@/app/_components/uploadImage/uploadImage";
import { updateQuestionAnswerImageUrl } from "@/app/_actions/updateQuestionAnswerImage";

type GenericField = {
    item: ColumnName;
    tableItemRef: MutableRefObject<Refs<HTMLElement>>;
    card: Flashcard_item;
    itemEditRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement>
    >;
    inputValues: InputValues;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        itemKey: string
    ) => void;
    labelEditEnterHandler: (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: ColumnName,
        id: string
    ) => void;
    updateCardHandler: ({ id, object, value }: UpdateCardTypes) => void;
    labelItemEditHandler: (key: string) => void;
    itemLabelRef: MutableRefObject<Refs<HTMLInputElement>>;
    editInputRef: MutableRefObject<
        Refs<HTMLTextAreaElement | HTMLInputElement>
    >;
};

function GenericTableItem({
    item,
    tableItemRef,
    card,
    itemEditRef,
    inputValues,
    handleInputChange,
    labelEditEnterHandler,
    updateCardHandler,
    // Invisible Input PopOver Toggler
    labelItemEditHandler,
    itemLabelRef,
    editInputRef,
}: GenericField) {
    const defaultImg =
        item === "item_answer"
            ? card.answer_img
            : item === "item_question"
            ? card.question_img
            : null;

    const defaultText = card[item] || "";

    const [text, setText] = useState<string>();
    const [image, setImage] = useState<File | null>();
    const [uploadImageModal, setUploadImageModal] = useState<boolean>(false);

    const uploadImage = async () => {
        try {
            if (image) {
                const imageUpload = await uploadImageHandler(image);
                if (imageUpload) {
                    const updateImgDb = await updateQuestionAnswerImageUrl({
                        type: (item as "item_question") || "item_answer",
                        image: imageUpload.url,
                        id: card.id,
                    });
                    console.log(updateImgDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (image) {
            uploadImage();
        }
    }, [image]);

    return (
        <>
            {/* Label Value  */}
            <div
                className={`${style.tableItem} ${style.tableWordBreak}`}
                ref={(el) => {
                    tableItemRef.current[`${item}~${card.id}`] = el;
                }}
            >
                {defaultImg && !image && (
                    <div className={style.imageThumbnail}>
                        <img
                            className={style.uploadedImagePreview}
                            src={defaultImg}
                            alt={``}
                        />
                    </div>
                )}
                {image && (
                    <div className={style.imageThumbnail}>
                        <img
                            className={style.uploadedImagePreview}
                            src={URL.createObjectURL(image)}
                            alt={``}
                        />
                    </div>
                )}
                <span>{text || (card[item] as string)}</span>
            </div>
            {/* Invisible Input */}
            <PopToggler
                labelItemEditHandler={labelItemEditHandler}
                itemLabelRef={itemLabelRef}
                item={item}
                card={card}
            />
            {/* PopOver */}
            <div
                className={style.itemInputEdit}
                ref={(el) => {
                    itemEditRef.current[`${item}~${card.id}`] = el;
                }}
            >
                {!uploadImageModal && (
                    <>
                        {image && (
                            <div className={style.imageContainerWrap}>
                                <div className={style.imageContainer}>
                                    <img
                                        className={style.uploadedImagePreview}
                                        src={URL.createObjectURL(image)}
                                        alt={image.name}
                                    />
                                </div>
                            </div>
                        )}
                        {defaultImg && !image && (
                            <div className={style.imageContainerWrap}>
                                <div className={style.imageContainer}>
                                    <img
                                        className={style.uploadedImagePreview}
                                        src={defaultImg}
                                        alt={defaultImg}
                                    />
                                </div>
                            </div>
                        )}
                        <ReactTextareaAutosize
                            id={`${item}-${card.id}-edit`}
                            value={
                                inputValues[`${item}~${card.id}`] ??
                                (item !== "item_tags" &&
                                item !== "last_modified"
                                    ? card[item]
                                    : "")
                            }
                            ref={(el) =>
                                (editInputRef.current[`${item}~${card.id}`] =
                                    el)
                            }
                            onChange={(e) => (
                                setText(e.target.value || " "),
                                handleInputChange(e, `${item}~${card.id}`)
                            )}
                            onKeyDown={(e) =>
                                labelEditEnterHandler(e, item, card.id)
                            }
                        />
                    </>
                )}
                <div className={style.popContent}>
                    <div>
                        <button
                            onClick={() => setUploadImageModal(true)}
                            className={style.popButtons}
                        >
                            <FaImage />
                            <span className={style.popButtonHoverLabel}>
                                Upload Image
                            </span>
                        </button>
                    </div>
                    <div>
                        <div
                            style={{
                                display: !uploadImageModal ? "none" : "unset",
                            }}
                        >
                            <ButtonWrap
                                handler={() => setUploadImageModal(false)}
                                variant="Black"
                            >
                                <div className={style.returnBtn}>
                                    <HiArrowUturnLeft />
                                </div>
                            </ButtonWrap>
                        </div>
                    </div>
                </div>
                {uploadImageModal && (
                    <div className={style.uploadImageContainer}>
                        <UploadImage
                            onUploadHandler={() => setUploadImageModal(false)}
                            insertOnUpload={true}
                            showImage={false}
                            image={image}
                            setImage={setImage}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default GenericTableItem;
