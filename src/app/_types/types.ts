import NextAuth, { type DefaultSession } from "next-auth";
import { DateTime } from "next-auth/providers/kakao";

export type ExtendedUser = DefaultSession["user"] & {
    role: "ADMIN" | "USER";
    id: string;
};

// EXTENDING default types of Next-Auth Session to include additional attributes - e.g -role
declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

export type User = {
    id: string;
    userName?: string;
    email?: string;
    email_verified?: Date;
    image?: string;
    password: string;
    role: UserRole;
    accounts: Account[];
};

export type Account = {
    id: string;
    user_id: string;
    favourites: string[];
    history: string[];
};

// export type Account = {
//     id: string;
//     userId: string;
//     type: string;
//     provider: string;
//     providerAccountId: string;
//     refresh_token?: string;
//     access_token?: string;
//     expires_at?: DateTime;
//     token_type?: string;
//     scope?: string;
//     id_token?: string;
//     session_state?: string;
// };

export type VerificationToken = {
    id: string;
    email: string;
    token: string;
    expires: Date;
};

export type PasswordResetToken = {
    id: string;
    email: string;
    token: string;
    expires: Date;
};

export type Flashcard_set = {
    id: string;
    user_id: string;
    set_name: string;
    set_categories: string[];
    description: string;
    image: string;
    last_modified: Date;
    public_access: boolean;
    copied_reference: string;
    original_id: string;
};

export type Flashcard_collection = {
    id: string;
    ids: string[];
    user_id: string;
    collection_name: string;
    original_id: string;
};

export type Flashcard_set_with_count = Flashcard_set & {
    count: number;
};

export type Flashcard_set_with_cards = Flashcard_set & {
    flashcards: Flashcard_item[];
};

export type Flashcard_collection_preview = {
    id: string;
    ids: string[];
    user_id: string;
    collection_name: string;
    original_id: string;
    sets: Flashcard_set_with_cards[];
};

enum Difficulty {
    NA = "NA",
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export type Flashcard_item = {
    id: string;
    set_id: string;
    item_question: string;
    item_answer: string;
    item_tags: string[];
    question_img: string;
    answer_img: string;
    difficulty: Difficulty;
    last_modified: Date;
};
