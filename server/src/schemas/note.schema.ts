import z from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(1).max(100),
    text: z.string().min(1),
    studySessionId: z.coerce.number().int().positive()
})

export const updateNoteSchema = createNoteSchema
    .omit({ studySessionId: true })
    .partial()
