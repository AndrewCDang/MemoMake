"use client";
import React, { useEffect } from "react";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";

function CollectionTest({ res }: { res: Flashcard_collection_set_joined[] }) {
    useEffect(() => {
        console.log(res);
        console.log(res[0].set_items);
    }, []);
    return <div>CollectionTest</div>;
}

export default CollectionTest;
