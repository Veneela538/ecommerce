import { z } from "zod";

const DEBUG_VALUES = ["DEBUG", "NONE"] as const;

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BACKEND_APP_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  AUTH_SESSION_MAX_AGE: z.string(),
  DEBUG: z.enum(DEBUG_VALUES),
});

export const env = envSchema.parse(process.env);
