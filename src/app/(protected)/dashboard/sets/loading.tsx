"use client";
import LoadingSectionTemplate from "@/app/_components/setCollectionContentSection/loadingSetCollectionTemplate";
import React from "react";

function loading() {
    return (
        <div>
            <LoadingSectionTemplate createBtn={true} contentType="set" />
        </div>
    );
}

export default loading;
