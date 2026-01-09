"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const updateWishlist = async (variantId: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/wishlist`,
      accessToken: session?.accessToken,
      body: {
        variantId: variantId,
      },
    });
  } catch (error) {
    throw error;
  }
};
