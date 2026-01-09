import z from "zod";

export const ProfileFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),

  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters long" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters long" }),

  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Enter a valid Indian mobile number",
  }),

  email: z.string().email().max(50, "Exceeds the permitted limit of 50"),
});
