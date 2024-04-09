import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/_lib/db";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { message: "Error: Could not fetch user" },
            {
                status: 500,
            }
        );
    }

    try {
        const users = await db`
      SELECT * FROM users
      WHERE id = ${userId}
    `;

        const user = users[0];
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error: Could not fetch user" },
            {
                status: 500,
            }
        );
    }
}
