"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getOrderById = async (orderId: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/order/${orderId}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getOrderById;
