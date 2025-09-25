import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required.")
    .min(4, "Username must contain at least 4 character(s)"),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must contain at least 8 character(s)"),
});
