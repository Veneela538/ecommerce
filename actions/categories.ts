"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getCategories = async () => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/category`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
