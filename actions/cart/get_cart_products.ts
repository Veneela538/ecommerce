"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getCartProducts = async () => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/cart`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
