"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getRatingCount = async (variantAsin: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/review/count/${variantAsin}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getRatingCount;
