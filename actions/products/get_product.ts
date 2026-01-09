"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getProduct = async (pid: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/product/${pid}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getProduct;
