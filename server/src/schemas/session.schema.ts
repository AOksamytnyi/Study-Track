import z from "zod";

export const createSessionSchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().max(2000),
    date: z.coerce.date(),
    duration: z.coerce.number().int().positive(),
    difficulty: z.enum(['easy', 'medium', 'hard'])
})

export const updateSessionSchema = createSessionSchema.partial()

export const tagSchema = z.object({
    name: z.string().trim().min(1).max(20).optional(),
    tagId: z.coerce.number().int().positive().optional()
}).refine((data) => data.name || data.tagId, {
    message: "Tag name or tag id is required",
})
