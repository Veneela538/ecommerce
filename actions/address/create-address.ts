"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { AddressFormSchema } from "@/schemas/address-form";
import z from "zod";

export const createAddress = async (
  values: z.infer<typeof AddressFormSchema>
) => {
  const validatedFields = AddressFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }
  const session = await auth();
  try {
    return await fetchWrapper.post({
      url: `/user/address`,
      accessToken: session?.accessToken,
      body: values,
    });
  } catch (error) {
    throw error;
  }
};
