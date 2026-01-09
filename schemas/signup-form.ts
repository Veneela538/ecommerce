import { z } from "zod";

export const CredentialsFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(100, { message: "Username must be at most 20 characters long" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const SignupFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters long" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters long" }),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  email: z.string().email({ message: "Invalid email address" }),
});

export type UserSchemaType = z.infer<typeof SignupFormSchema>;
