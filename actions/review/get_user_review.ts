"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getUserReview = async (variantAsin: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/review/${variantAsin}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
