"use client";
import LoadingCircle from "@/app/_components/loadingUi/loadingCircle";
import LoadingSectionTemplate from "@/app/_components/setCollectionContentSection/loadingSetCollectionTemplate";
import React from "react";
import style from "./existingSets.module.scss";

function loading() {
    return (
        <div>
            <div className={style.loadingPageWrap}>
                <LoadingCircle variant="contain" />
            </div>
            <LoadingSectionTemplate createBtn={true} contentType="set" />
            <LoadingSectionTemplate createBtn={true} contentType="collection" />
        </div>
    );
}

export default loading;
