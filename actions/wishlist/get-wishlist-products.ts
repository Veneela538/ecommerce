"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getWishlistProducts = async () => {
  const session = await auth();
  return fetchWrapper.get({
    url: `/user/wishlist`,
    accessToken: session?.accessToken,
  });
};
