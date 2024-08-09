import { z } from "zod";

export const ThemeColourSchema = z.union([
    z.literal("red"),
    z.literal("blue"),
    z.literal("yellow"),
    z.literal("green"),
    z.literal("purple"),
    z.literal("white"),
    z.literal("grey"),
    z.literal("black"),
    z.literal("lightGrey"),
    z.null(),
]);

export const CreateSetSchema = z.object({
    setName: z.string().min(1, "Name required"),
    description: z.string().nullable().optional(),
    colours: ThemeColourSchema.nullable().optional(),
    categories: z.array(z.string()).nullable().optional(),
});

export type CreateSetType = z.infer<typeof CreateSetSchema>;
