import React from "react";
import LoadingSectionTemplate from "../_components/setCollectionContentSection/loadingSetCollectionTemplate";

function loading() {
    return (
        <div>
            <LoadingSectionTemplate contentType="set" />
            <LoadingSectionTemplate contentType="collection" />
        </div>
    );
}

export default loading;
