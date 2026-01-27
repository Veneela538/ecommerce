"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { AddressUpdateSchema } from "@/schemas/address-form";
import { AddressResponseType } from "@/types";

export const updateAddress = async (values: AddressResponseType) => {
  const validatedFields = AddressUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }
  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/address`,
      accessToken: session?.accessToken,
      body: validatedFields.data,
    });
  } catch (error) {
    throw error;
  }
};
