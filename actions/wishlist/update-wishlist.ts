"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const updateWishlist = async (variantAsin: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/wishlist`,
      accessToken: session?.accessToken,
      body: {
        variantAsin: variantAsin,
      },
    });
  } catch (error) {
    throw error;
  }
};
