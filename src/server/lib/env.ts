import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().transform(Number).optional().default("3000"),
});

export const env = envSchema.parse(process.env);
