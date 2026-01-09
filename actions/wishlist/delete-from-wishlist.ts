"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const deleteFromWishlist = async (variantId: number) => {
  const session = await auth();
  return fetchWrapper.delete({
    url: `/user/wishlist/${variantId}`,
    accessToken: session?.accessToken,
  });
};
