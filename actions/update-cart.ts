"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const updateCart = async (variantId: number, count: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.post({
      url: `/user/cart`,
      accessToken: session?.accessToken,
      body: {
        variantId: variantId,
        quantity: count,
      },
    });
  } catch (error) {
    throw error;
  }
};
