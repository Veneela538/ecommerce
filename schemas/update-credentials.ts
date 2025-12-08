import { z } from "zod";

export const UpdateCredentialsSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required.")
    .min(4, "Username must contain at least 4 character(s)"),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must contain at least 8 character(s)"),
  confirmPassword: z
    .string()
    .nonempty("Confirm Password is required.")
    .min(8, "Confirm Password must contain at least 8 character(s)"),
});
