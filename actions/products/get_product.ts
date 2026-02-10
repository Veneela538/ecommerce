"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getProduct = async (asin: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/product/${asin}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getProduct;
