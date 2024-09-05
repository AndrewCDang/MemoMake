import { auth } from "@/auth";
import {
    Difficulty,
    Flashcard_collection_with_cards,
    Flashcard_set_with_cards,
} from "../_types/types";
import Study from "./study";
import { notFound } from "next/navigation";
import next, { Metadata } from "next";
import { fetchStudyDetails } from "../_lib/fetch/fetchStudyDetails";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Quizmu | Study",
    description: "Study flashcard set/collection",
};

async function Page({ searchParams }: any) {
    const session = await auth();
    const collectionIds = searchParams.collection?.split("_") || [];
    const setIds = searchParams.set?.split("_") || [];
    const collectionTags = searchParams.tags?.split("_") || [];
    const collectionDifficulties =
        (searchParams.difficulties?.split("_") as Difficulty[]) || [];
    const userId = session?.user.id;

    const contentType =
        collectionIds.length > 0
            ? "collection"
            : setIds.length > 0
            ? "set"
            : null;

    const ids =
        collectionIds.length > 0
            ? collectionIds
            : setIds.length > 0
            ? setIds
            : null;

    if (!contentType || !ids) return notFound();

    const res = await fetch(
        `${
            process.env.NEXT_WEBSITE_URL
        }/api/fetch/fetchStudyFlashCards?type=${contentType}&ids=${ids
            .join("_")
            .toString()}&tags=${
            collectionDifficulties?.join("_").toString() || ""
        }&difficulties=${
            collectionDifficulties?.join("_").toString() || ""
        }&userId=${userId}
        `,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 60 * 60,
                tags: [ids],
            },
        }
    );
    if (!res.ok) {
        redirect("/dashboard");
    }
    const responseData = await res.json();

    const data = responseData.data as
        | Flashcard_collection_with_cards[]
        | Flashcard_set_with_cards[];

    return (
        <Study
            data={data}
            ids={ids}
            contentType={contentType}
            tags={collectionTags}
            difficulties={collectionDifficulties}
            userId={userId}
        />
    );
}

export default Page;
