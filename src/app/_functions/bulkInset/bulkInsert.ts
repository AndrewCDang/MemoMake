import { AuthItemTypes } from "@/schema/itemSchema";
import insertFlashCard from "../../_actions/insertFlashCard";

type BulkInsertTypes = {
    setId: string;
    dataArray: AuthItemTypes[];
};

const bulkInsert = async ({ setId, dataArray }: BulkInsertTypes) => {
    if (!dataArray) return;
    try {
        let successArray = [];
        for (const item of dataArray) {
            const fetch = await insertFlashCard({
                setId: setId,
                data: item,
            });
            successArray.push(fetch.success);
        }
        console.log(successArray);
    } catch (error) {
        console.log(error);
    }
};
