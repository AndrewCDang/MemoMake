"use server"

import { db } from "../_lib/db"

export async function fetchCollectionByIdWithSetAndItemCount({
    userId
}:{userId:string}){
    try {
        const fetch = await db`
            SELECT fc.*, COUNT(DISTINCT  fs.id) AS set_count, COUNT(DISTINCT fi.id) as item_count
            FROM flashcard_collection fc
            LEFT JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
            LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
            WHERE fs.user_id = ${userId}
            GROUP BY fc.id;
        `;
        return fetch
        
    } catch (error:unknown) {
        if(error instanceof Error){
            console.log(error)
        }
    }
}