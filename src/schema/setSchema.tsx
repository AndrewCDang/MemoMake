import { z } from "zod";

export const CreateSetSchema = z.object({
    setName: z.string().min(1, "Name required"),
    description: z.string(),
    categories: z.array(z.string()),
});

export type CreateSetType = z.infer<typeof CreateSetSchema>;
