"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getCategoryProducts = async (
  category: string,
  page: number,
  size: number,
) => {
  const session = await auth();
  try {
    const response = await fetchWrapper.get({
      url: `/public/category/${category}?page=${page}&size=${size}`,
      accessToken: session?.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default getCategoryProducts;
