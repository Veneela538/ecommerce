"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const searchProducts = async (query: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/search?query=${encodeURIComponent(query)}`,

      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
