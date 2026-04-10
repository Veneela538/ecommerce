"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { ReviewFilter } from "@/types";

const getReviews = async (
  variantAsin: string,
  page: number,
  size: number,
  ratingFilter?: number,
  mediaFilter?: ReviewFilter,
) => {
  const session = await auth();

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  // ✅ only add if exists
  if (ratingFilter !== undefined) {
    params.append("rating", String(ratingFilter));
  }

  if (mediaFilter) {
    params.append("filter", mediaFilter);
  }

  try {
    return await fetchWrapper.get({
      url: `/public/review/${variantAsin}?${params.toString()}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getReviews;
