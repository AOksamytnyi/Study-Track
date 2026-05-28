import z, { email } from "zod";

export const createSessionSchema = z.object({
    title: z.string().max(150),
    description: z.string(),
    date: z.date(),
    duration: z.int().positive(),
    difficulty: z.enum(['easy', 'medium', 'hard'])
})

export const updateSessionSchema = createSessionSchema.partial()