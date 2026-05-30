import z from "zod";

export const registerSchema = z.object({
    email: z.string(),
    username: z.string().min(2).max(50),
    password: z.string().min(8),
})

export const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(1)
})

