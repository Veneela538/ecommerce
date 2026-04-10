"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const getPaymentDetails = async (token: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/get-payment-details/${token}`,
      accessToken: session?.accessToken,
    });
  } catch (err) {
    throw err;
  }
};

export default getPaymentDetails;
