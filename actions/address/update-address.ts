"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { AddressFormSchema } from "@/schemas/address-form";
import { AddressResponseType } from "@/types";

export const updateAddress = async (values: AddressResponseType) => {
  const validatedFields = AddressFormSchema.safeParse(values);

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
