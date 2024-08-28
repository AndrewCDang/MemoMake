import { AuthItemTypes } from "@/schema/itemSchema";
import insertFlashCard from "../../_actions/insertFlashCard";

type BulkInsertTypes = {
    setId: string;
    dataArray: (AuthItemTypes & { id?: string })[];
    userId: string;
};

export const bulkInsert = async ({
    setId,
    dataArray,
    userId,
}: BulkInsertTypes) => {
    if (!dataArray) return;
    try {
        for (const item of dataArray) {
            const fetch = await insertFlashCard({
                userId: userId,
                setId: setId,
                data: item,
            });
        }
    } catch (error) {
        console.log(error);
    }
};
