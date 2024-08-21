import { ThemeColourSchema } from "@/schema/setSchema";
import { z } from "zod";

export const updateCollectionSchema = z.object({
    collectionId: z.string(),
    setIds: z.array(z.string()).min(1, {
        message: "Must have at least 1 set inside a collection",
    }),
    colours: ThemeColourSchema.nullable().optional(),
    name: z
        .string()
        .min(3, {
            message: "Collection name must have at least 3 characters",
        })
        .max(255, {
            message: "Collection name must have less than 255 characters",
        }),
    categories: z.array(z.string()),
    image: z.string().nullable().optional(),
});
