import { auth } from "@/auth";
import { Difficulty } from "../_types/types";
import Study from "./study";

async function page({ searchParams }: any) {
    const session = await auth();

    const collectionIds = searchParams.collection?.split("_") || [];
    const setIds = searchParams.set?.split("_") || [];
    const collectionTags = searchParams.tags?.split("_") || [];
    const collectionDifficulties =
        (searchParams.difficulties?.split("_") as Difficulty[]) || [];
    const userId = session?.user.id;

    return (
        <Study
            collectionIds={collectionIds}
            setIds={setIds}
            collectionTags={collectionTags}
            collectionDifficulties={collectionDifficulties}
            userId={userId}
        />
    );
}

export default page;
