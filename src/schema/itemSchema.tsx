import { z } from "zod";

const difficultyEnum = z.enum(["NA", "EASY", "MEDIUM", "HARD"]);

export const AuthItemSchema = z.object({
    item_question: z.string().min(1),
    item_answer: z.string().min(1),
    item_tags: z.array(z.string()),
    difficulty: difficultyEnum,
});

export type AuthItemTypes = z.infer<typeof AuthItemSchema>;
