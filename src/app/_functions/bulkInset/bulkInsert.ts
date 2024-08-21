import { AuthItemTypes } from "@/schema/itemSchema";
import insertFlashCard from "../../_actions/insertFlashCard";

type BulkInsertTypes = {
    setId: string;
    dataArray: AuthItemTypes[];
};

export const bulkInsert = async ({ setId, dataArray }: BulkInsertTypes) => {
    if (!dataArray) return;
    try {
        for (const item of dataArray) {
            const fetch = await insertFlashCard({
                setId: setId,
                data: item,
            });
        }
    } catch (error) {
        console.log(error);
    }
};
