"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const addToCartAndSavedForLater = async (
  variantId: number,
  quantity: number,
) => {
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/cart/save-for-later`,
      accessToken: session?.accessToken,
      body: {
        variantId: variantId,
        quantity: quantity,
      },
    });
  } catch (error) {
    throw error;
  }
};
