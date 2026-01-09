"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { CheckoutFormSchema } from "@/schemas/checkout-form";
import * as z from "zod";

export const singleOrderCheckout = async (
  variantId: number,
  values: z.infer<typeof CheckoutFormSchema>
) => {
  const validatedFields = CheckoutFormSchema.safeParse(values);
  const session = await auth();

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  try {
    return await fetchWrapper.post({
      url: `/user/single-order`,
      accessToken: session?.accessToken,
      body: {
        variantId: variantId,
        ...values,
      },
    });
  } catch (error) {
    throw error;
  }
};
