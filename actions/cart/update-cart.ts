"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const updateCart = async (variantAsin: string, count: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.post({
      url: `/user/cart`,
      accessToken: session?.accessToken,
      body: {
        variantAsin: variantAsin,
        quantity: count,
      },
    });
  } catch (error) {
    throw error;
  }
};
