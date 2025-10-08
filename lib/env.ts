import { z } from "zod";

const DEBUG_VALUES = ["DEBUG", "NONE"] as const;

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BACKEND_APP_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  AUTH_SESSION_MAX_AGE: z.string(),
  DEBUG: z.enum(DEBUG_VALUES),
});

// ✅ Explicitly mapping each variable ensures compatibility with Next.js 15’s runtime
export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BACKEND_APP_URL: process.env.NEXT_PUBLIC_BACKEND_APP_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_SESSION_MAX_AGE: process.env.AUTH_SESSION_MAX_AGE,
  DEBUG: process.env.DEBUG,
});
