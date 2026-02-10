"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const addToCartAndSavedForLater = async (
  variantAsin: string,
  quantity: number,
) => {
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/cart/save-for-later`,
      accessToken: session?.accessToken,
      body: {
        variantAsin: variantAsin,
        quantity: quantity,
      },
    });
  } catch (error) {
    throw error;
  }
};
