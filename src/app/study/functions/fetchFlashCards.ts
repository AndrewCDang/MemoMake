import {
    ContentType,
    Flashcard_collection_with_cards,
    Flashcard_item,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { CombinedType } from "../study";
import { shuffleArray } from "@/app/_functions/shuffleArray";

type FetchFlashCardsTypes = {
    contentType: ContentType;
    ids: string[];
    tags: string[] | undefined;
    difficulties: string[] | undefined;
    userId: string | undefined;
    setFlashCardItemsTest: React.Dispatch<React.SetStateAction<CombinedType[]>>;
    setTitles: React.Dispatch<React.SetStateAction<string>>;
    setSubTitles: React.Dispatch<React.SetStateAction<string[]>>;
};

const initialTestCards = (flashcardItems: Flashcard_item[]) =>
    flashcardItems.length > 0
        ? (flashcardItems.map((item) => {
              return { ...item, correct: null, copy: false };
          }) as CombinedType[])
        : [];

/**
 *
 * Fetches Flashcards if flashcards wtihin global client state  is empty
 */
export const fetchFlashCards = async ({
    contentType,
    ids,
    tags,
    difficulties,
    userId,
    setFlashCardItemsTest,
    setTitles,
    setSubTitles,
}: FetchFlashCardsTypes) => {
    try {
        const res = await fetch(
            `/api/fetch/fetchStudyFlashCards?type=${contentType}&ids=${ids.join(
                "_"
            )}&tags=${tags?.join("_").toString() || ""}&difficulties=${
                difficulties?.join("_").toString() || ""
            }`,
            {
                method: "GET",
                body: JSON.stringify({
                    userId: userId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Raw response:", res);

        if (res.ok) {
            const responseData = await res.json();

            if (responseData.status === 500) {
                return { status: 500 };
            }

            const data = responseData.data as
                | Flashcard_collection_with_cards[]
                | Flashcard_set_with_cards[];

            if (data) {
                const flashCards = data.flatMap((col) => col.flashcards);
                const uniqueFlashCards = flashCards.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );

                setFlashCardItemsTest(
                    shuffleArray<CombinedType>(
                        initialTestCards(uniqueFlashCards)
                    )
                );

                console.log(data[0]);
                if (ids.length === 1 && data[0].content_type === "collection") {
                    setTitles(data[0].collection_name);
                    console.log(data[0].collection_name);
                } else if (ids.length === 1 && data[0].content_type === "set") {
                    setTitles(data[0].set_name);
                    console.log(data[0].set_name);
                }

                // const collectionSubtitles = (
                //     data as Flashcard_collection_with_cards[]
                // )
                //     .flatMap((item) => item.sets)
                //     .filter(
                //         (item, index, self) =>
                //             index === self.findIndex((t) => t === item)
                //     );
                // setSubTitles(collectionSubtitles);

                return { status: 200, data: uniqueFlashCards };
            }
        } else {
            console.log(res);
            return { status: 500 };
        }
    } catch (error) {
        console.log(error);
        console.log("errorrrr");
        return { status: 500, error };
    }
};
