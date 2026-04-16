import { z } from "zod";

export const AddressFormSchema = z
  .object({
    country: z.string().min(1, { message: "Please enter country." }),
    name: z
      .string()
      .min(1, { message: "Please enter a name." })
      .max(100, { message: "First name must be at most 100 characters long." }),

    phoneNumber: z.string().regex(/^\d{10}$/, {
      message:
        "Please enter a phone number so we can call if there are any issues with delivery.",
    }),
    alternativePhoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{10}$/.test(val), {
        message: "Enter valid 10-digit phone number",
      }),
    pincode: z
      .string()
      .regex(/^\d{6}$/, { message: "Please enter a ZIP or postal code." }),

    addressLine1: z.string().min(1, { message: "Please enter Address Line 1" }),

    addressLine2: z.string().optional(),

    addressLine3: z.string().optional(),

    city: z.string().min(1, { message: "Please enter a city name." }),

    state: z
      .string()
      .min(1, { message: "Please enter a state, region or province." }),
  })
  .refine(
    (data) =>
      !data.alternativePhoneNumber ||
      data.alternativePhoneNumber !== data.phoneNumber,
    {
      message: "Alternative number cannot be same as phone number",
      path: ["alternativePhoneNumber"],
    },
  );

export const AddressUpdateSchema = AddressFormSchema.safeExtend({
  id: z.number(),
});
