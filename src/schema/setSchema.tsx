import { z } from "zod";

export const CreateSetSchema = z.object({
    setName: z.string().min(1, "Name required"),
    description: z.string().nullable().optional(),
    categories: z.array(z.string()).nullable().optional(),
});

export type CreateSetType = z.infer<typeof CreateSetSchema>;
