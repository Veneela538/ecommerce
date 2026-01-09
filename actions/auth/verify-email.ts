"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const verifyEmail = async (email: string) => {
  const session = await auth();
  try {
    const response = await fetchWrapper.get({
      url: `/auth/account-recovery/${email}`,
      accessToken: session?.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default verifyEmail;
