import { z } from "zod";

export const formSchema = z.object({
    word: z.string()
        .trim()
        .min(1, "Cannot be empty")
        .max(50)
        .regex(/^[a-zA-Z\s-]+$/, "Only letters, hyphens, and spaces are allowed")
});

export type FormSchema = typeof formSchema;
