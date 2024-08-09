// app/api/fetch/fetchCollectionHandler/route.ts
import { fetchCollectionByIdWithSetAndItemCount } from "@/app/_lib/fetch/fetchCollectionByIdWithSetAndItemCount";
import { ContentType } from "@/app/_types/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");

    if (!type || !userId) {
        return new Response("Missing parameters", { status: 400 });
    }

    try {
        const data = await fetchCollectionByIdWithSetAndItemCount({
            userId: userId,
            type: type as ContentType,
        });
        return Response.json({ data });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response(error.message, { status: 500 });
        }
        return new Response("An unknown error occurred", { status: 500 });
    }
}
