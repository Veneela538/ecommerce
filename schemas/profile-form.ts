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

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  email: z.string().email({ message: "Invalid email address" }),

  addressLine1: z.string().min(1, { message: "Address is required" }),

  addressLine2: z.string().min(1, { message: "Address is required" }),

  addressLine3: z.string().optional(),

  pincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),
});
