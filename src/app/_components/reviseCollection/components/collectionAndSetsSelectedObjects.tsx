"use client";
import React from "react";
import { useReviseModal } from "../useReviseModal";
import CornerClose from "../../cornerClose/cornerClose";
import style from "../reviseCards.module.scss";

function CollectionAndSetsSelectedObjects() {
    const {
        initialCollectionItems,
        setInitialCollectionItems,
        isReviseModalOn,
        hideReviseModal,
        initialSetItems,
        setInitalSet,
        reviseModalType,
    } = useReviseModal();
    return (
        <>
            {initialCollectionItems &&
                reviseModalType === "collection" &&
                initialCollectionItems.map((item) => {
                    return (
                        <div key={item.id} className={style.setCard}>
                            <CornerClose
                                cornerSpace="tight"
                                handler={() => console.log("hi")}
                                // handler={() => setListHandler(item)}
                            />
                            <div className={style.setCardTitle}>
                                {item.collection_name}
                            </div>
                        </div>
                    );
                })}
            {initialSetItems &&
                reviseModalType === "set" &&
                initialSetItems.map((item) => {
                    return (
                        <div key={item.id} className={style.setCard}>
                            <CornerClose
                                cornerSpace="tight"
                                handler={() => console.log("hi")}
                                // handler={() => setListHandler(item)}
                            />
                            <div className={style.setCardTitle}>
                                {item.set_name}
                            </div>
                        </div>
                    );
                })}
        </>
    );
}

export default CollectionAndSetsSelectedObjects;
