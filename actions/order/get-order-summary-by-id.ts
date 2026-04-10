"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getOrderSummaryById = async (orderId: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/order/${orderId}/summary`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getOrderSummaryById;
