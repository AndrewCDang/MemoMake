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
    setFlashCardItemsTest: React.Dispatch<React.SetStateAction<CombinedType[]>>;
    setTitles: React.Dispatch<React.SetStateAction<string[]>>;
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
    setFlashCardItemsTest,
    setTitles,
    setSubTitles,
}: FetchFlashCardsTypes) => {
    try {
        // Fetching Api handler which fetches collection of sets/collection
        const res = await fetch(
            `/api/fetch/fetchStudyFlashCards?type=${contentType}&ids=${ids.join(
                "_"
            )}&tags=${tags?.join("_") || ""}&difficulties=${
                difficulties?.join("_") || ""
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (res.ok) {
            const responseData = await res.json();
            const data = responseData.data as
                | Flashcard_collection_with_cards[]
                | Flashcard_set_with_cards[];

            if (data) {
                const flashCards = data.flatMap((col) => col.flashcards);
                const uniqueFlashCards = flashCards.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                // Setting Flashcards from response data
                setFlashCardItemsTest(
                    shuffleArray<CombinedType>(
                        initialTestCards(uniqueFlashCards)
                    )
                );
                const collectionTitles = (
                    data as Flashcard_collection_with_cards[]
                ).map((item) => item.collection_name);
                setTitles(collectionTitles);

                const collectionSubtitles = (
                    data as Flashcard_collection_with_cards[]
                )
                    .flatMap((item) => item.sets)
                    .filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t === item)
                    );
                setSubTitles(collectionSubtitles);
            }
        } else {
            console.log(res);
        }
    } catch (error) {
        console.log(error);
    }
};
