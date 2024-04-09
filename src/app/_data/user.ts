"use server";
import { db } from "../_lib/db";
import { User } from "../_types/types";

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const users = await db`
        SELECT * FROM users
        WHERE email = ${email}`;

        const user = users[0];
        return user as User;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const users = await db`
            SELECT * FROM users
            WHERE id = ${id}
        `;

        const user = users[0];
        return user as User;
    } catch (error) {
        console.log(error);
        return null;
    }
};
