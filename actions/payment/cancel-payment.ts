"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const cancelPayment = async (token: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.post({
      url: `/user/${token}/cancel-payment`,
      accessToken: session?.accessToken,
      body: {},
    });
  } catch (error) {
    throw error;
  }
};

export default cancelPayment;
