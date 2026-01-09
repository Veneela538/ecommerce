"use server";

import { fetchWrapper } from "@/lib/fetch";
import { SignupFormSchema } from "@/schemas/signup-form";
import * as z from "zod";

export const signup = async (
  values: z.infer<typeof SignupFormSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = SignupFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  try {
    const response = await fetchWrapper.post({
      url: `/auth/signup`,
      body: values,
      accessToken: undefined,
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
