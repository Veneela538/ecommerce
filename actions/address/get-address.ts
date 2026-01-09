"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getAddress = async () => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/address`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
