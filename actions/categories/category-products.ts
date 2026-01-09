"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getCategoryProducts = async (category: string) => {
  const session = await auth();
  try {
    const response = await fetchWrapper.get({
      url: `/public/category/${category}`,
      accessToken: session?.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default getCategoryProducts;
