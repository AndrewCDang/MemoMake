import { z } from "zod";

export const ReviseSetSchema = z.object({
    sets: z.array(z.string()),
    reviseAll: z.boolean(),
    amountQuestions: z.number(),
    difficulty: z.array(z.enum(["NA", "EASY", "MEDIUM", "HARD"])),
});

export type ReviseSetSchemaType = z.infer<typeof ReviseSetSchema>;
