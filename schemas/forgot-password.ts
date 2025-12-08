import { z } from "zod";

export const ForgotpasswordSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required.")
    .min(4, "Username must contain at least 4 character(s)"),
});
