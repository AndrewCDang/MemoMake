import NextAuth, { type DefaultSession } from "next-auth";
import { DateTime } from "next-auth/providers/kakao";

export type ExtendedUser = DefaultSession["user"] & {
    role: "ADMIN" | "USER";
    id: string;
    image: string;
    user_name: string;
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

export type BasicUserDetails = {
    id: string;
    user_name?: string;
    image?: string;
};

export type User = BasicUserDetails & {
    email?: string;
    email_verified?: Date;
    password: string;
    role: UserRole;
    accounts: Account[];
};

export type ContentType = "collection" | "set";

export type UserHistory = {
    ids: string[][];
    tags: string[][];
    difficulties: Difficulty[][];
    content_type: ContentType;
    score: number;
};

export type Account = {
    id: string;
    user_id: string;
    favourites: string[];
    user_history: UserHistory[];
};

export type UserLikes = {
    id: string;
    item_id: string;
    user_id: string;
    item_type: ContentType;
};
export type AccountWithLikes = {
    id: string;
    user_id: string;
    favourites: string[];
    user_history: UserHistory[];
    user_likes: UserLikes[];
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

export type ThemeColour = "red" | "blue" | "yellow" | "green" | "purple" | null;

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
    theme_colour: ThemeColour;
    creator: BasicUserDetails;
    like_count: number;
};

export type Flashcard_collection = {
    id: string;
    ids: string[];
    user_id: string;
    collection_name: string;
    original_id: string;
    set_categories: string[];
    description: string;
    image: string;
    public_access: boolean;
    theme_colour: ThemeColour;
    creator: BasicUserDetails;
    like_count: number;
};

export type Flashcard_collection_with_count = Flashcard_collection & {
    set_count: number;
    item_count: number;
};

export type Flashcard_collection_with_type = Flashcard_collection & {
    content_type: "collection";
};

export type Flashcard_set_with_count = Flashcard_set & {
    item_count: number;
};
export type Flashcard_set_with_type = Flashcard_set & {
    content_type: "set";
};

export type Flashcard_set_with_cards = Flashcard_set & {
    flashcards: Flashcard_item[];
};

export type Flashcard_collection_with_cards = Flashcard_collection & {
    sets: string[];
    flashcards: Flashcard_item[];
};

export type Flashcard_collection_preview = Flashcard_collection & {
    sets: Flashcard_set_with_cards[];
};

export enum Difficulty {
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
