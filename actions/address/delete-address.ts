"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export const deleteAddress = async (addressId: number) => {
  const session = await auth();
  try {
    return await fetchWrapper.delete({
      url: `/user/address/${addressId}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};
