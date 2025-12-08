"use server";

import { fetchWrapper } from "@/lib/fetch";
import { SignupFormSchema } from "@/schemas/signup-form";
import * as z from "zod";

export const signup = async (
  values: z.infer<typeof SignupFormSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = SignupFormSchema.safeParse(values);

  const { addressLane1, addressLane2, addressLane3, addressLane4, ...rest } =
    values;

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const address = [addressLane1, addressLane2, addressLane3, addressLane4]
    .filter(Boolean)
    .join(", ");

  const payload = {
    ...rest,
    address,
  };

  try {
    const response = await fetchWrapper.post({
      url: `/auth/signup`,
      body: payload,
    });
    // if (response.status) {
    //   redirect("/auth/login");
    // }
    return response;
  } catch (error) {
    throw error;
  }
  // finally {
  //   redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT)
  // }
};
