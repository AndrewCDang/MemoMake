import { studyFetchFlashCards } from "@/app/_lib/fetch/studyFetchFlashCards";
import { ContentType, Difficulty } from "@/app/_types/types";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    console.log("pumba");

    const session = await auth();
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

    if (!idsArray) {
        return new Response("No set/collection ids available for fetch");
    }

    try {
        const data = await studyFetchFlashCards({
            fetchObject: { type: type as ContentType, id: idsArray },
            tags: tagsArray,
            difficulties: difficultiesArray,
        });

        const userId = session?.user.id;
        if (
            data &&
            !data.some((item) => item.public_access || item.user_id === userId)
        ) {
            return new Response(
                JSON.stringify({
                    error: "You do not have access to this content",
                }),
                { status: 403 }
            );
        }

        return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
            });
        }
        return new Response(
            JSON.stringify({ error: "An unknown error occurred" }),
            { status: 500 }
        );
    }
}
