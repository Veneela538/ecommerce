"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { CheckoutFormSchema } from "@/schemas/checkout-form";
import * as z from "zod";

export const orderCheckout = async (
  values: z.infer<typeof CheckoutFormSchema>,
) => {
  const validatedFields = CheckoutFormSchema.safeParse(values);
  const session = await auth();

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const { shippingAddress, ...rest } = values;

  try {
    return await fetchWrapper.post({
      url: `/user/order`,
      accessToken: session?.accessToken,
      body: {
        ...rest,
        deliveryAddress: shippingAddress,
      },
    });
  } catch (error) {
    throw error;
  }
};
