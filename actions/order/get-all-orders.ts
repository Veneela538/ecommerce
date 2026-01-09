"use server";
import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getAllOrders = async () => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/order`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getAllOrders;
