import { z } from "zod";

export enum Title {
  Mr = "Mr",
  Mrs = "Mrs",
  Ms = "Ms",
  Dr = "Dr",
  Prof = "Prof",
}

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  title: z
    .enum(Title, {
      message: "Invalid title",
    })
    .or(z.literal("")),

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

  address: z.string().min(1, { message: "Address is required" }),

  pincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),
});

// ✅ Type inference for TS
export type UserSchemaType = z.infer<typeof SignupFormSchema>;
