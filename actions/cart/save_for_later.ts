"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const savedForLater = async (cartId: number, saveForLater: boolean) => {
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/save-for-later`,
      accessToken: session?.accessToken,
      body: {
        cartItemId: cartId,
        savedForLater: saveForLater,
      },
    });
  } catch (error) {
    throw error;
  }
};
