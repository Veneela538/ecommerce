"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const getUserDetails = async () => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/user/user-details`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
