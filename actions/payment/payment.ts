"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

const payment = async (token: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.post({
      url: `/user/${token}/pay`,
      accessToken: session?.accessToken,
      body: {},
    });
  } catch (err) {
    throw err;
  }
};

export default payment;
