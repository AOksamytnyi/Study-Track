import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CLIENT_URL: z.string().url().optional(),
  PORT: z.coerce.number().default(3000),
});


const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error(result.error.format())
  throw new Error('Invalid environment variables')
}

export const env = result.data
