import { z } from "zod";

export const UpdateSetSchema = z.object({
    set_name: z.string().min(1).optional(),
    description: z.string().optional(),
    set_categories: z.array(z.string()).optional(),
});

export type UpdateSetTypes = z.infer<typeof UpdateSetSchema>;

export type UpdateSetOptionsTypes =
    | "set_name"
    | "description"
    | "set_categories";
