import { studyFetchFlashCards } from "@/app/_lib/fetch/studyFetchFlashCards";
import { ContentType, Difficulty } from "@/app/_types/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const ids = searchParams.get("ids");
    const tags = searchParams.get("tags");
    const difficulties = searchParams.get("difficulties");

    const idsArray = ids ? ids.split("_") : null;
    const tagsArray = tags ? tags.split("_") : undefined;
    const difficultiesArray = difficulties
        ? (difficulties.split("_") as Difficulty[])
        : undefined;

    if (!idsArray)
        return new Response("No set/collection ids available for fetch");

    try {
        const data = await studyFetchFlashCards({
            fetchObject: { type: type as ContentType, id: idsArray },
            tags: tagsArray,
            difficulties: difficultiesArray,
        });
        console.log(data);
        return Response.json({ data });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response(error.message, { status: 500 });
        }
        return new Response("An unknown error occurred", { status: 500 });
    }
}
