"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getReviewById = async (reviewId: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/review/id/${reviewId}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getReviewById;
