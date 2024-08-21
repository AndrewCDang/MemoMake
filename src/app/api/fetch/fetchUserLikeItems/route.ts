import { NextRequest } from "next/server";
import { db } from "@/app/_lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("id");
    const limit = searchParams.get("limit") || null;
    console.log(userId);
    console.log(limit);

    try {
        const searchLimit = db`LIMIT ${limit}`;

        const fetch = await db`
            SELECT * FROM user_likes
            WHERE user_id = ${userId}
            ORDER BY created DESC
            ${limit ? searchLimit : db``}
        `;

        console.log(fetch);
        return Response.json({ fetch });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
            return new Response(error.message, { status: 500 });
        }
    }
}
