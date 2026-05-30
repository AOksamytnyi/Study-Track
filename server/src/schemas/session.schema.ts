import z from "zod";

export const createSessionSchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().max(2000),
    date: z.coerce.date(),
    duration: z.coerce.number().int().positive(),
    difficulty: z.enum(['easy', 'medium', 'hard'])
})

export const updateSessionSchema = createSessionSchema.partial()