"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getAllOrders = async (page: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/order?page=${page}&size=10`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getAllOrders;
