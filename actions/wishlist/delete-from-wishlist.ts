"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const deleteFromWishlist = async (variantAsin: string) => {
  const session = await auth();
  return fetchWrapper.delete({
    url: `/user/wishlist/${variantAsin}`,
    accessToken: session?.accessToken,
  });
};
