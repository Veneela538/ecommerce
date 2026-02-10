"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { CheckoutFormSchema } from "@/schemas/checkout-form";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const singleOrderCheckout = async (
  variantAsin: string,
  values: z.infer<typeof CheckoutFormSchema>,
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
        variantAsin: variantAsin,
        ...values,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const refreshCheckout = async () => {
  revalidatePath(`/checkout`);
};
