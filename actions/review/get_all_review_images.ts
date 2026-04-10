"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getAllReviewImages = async (
  variantAsin: string,
  page: number,
  size: number,
) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/review/images/${variantAsin}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getAllReviewImages;
