import { auth } from "@/auth";
import { Difficulty } from "../_types/types";
import Study from "./study";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Flashmu | Study",
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

    return (
        <Study
            ids={ids}
            contentType={contentType}
            tags={collectionTags}
            difficulties={collectionDifficulties}
            userId={userId}
        />
    );
}

export default Page;
