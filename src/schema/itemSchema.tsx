import { z } from "zod";

const difficultyEnum = z.enum(["NA", "EASY", "MEDIUM", "HARD"]);

export const AuthItemSchema = z.object({
    item_question: z.string().optional(),
    item_answer: z.string().optional(),
    item_tags: z.array(z.string()).optional(),
    difficulty: difficultyEnum,
});

export type AuthItemTypes = z.infer<typeof AuthItemSchema>;
