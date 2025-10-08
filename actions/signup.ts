"use server";

import { currentSession } from "@/lib/auth";
import { fetchWrapper } from "@/lib/fetch";
import { SignupFormSchema } from "@/schemas/signup-form";
import { redirect } from "next/navigation";
import * as z from "zod";

export const signup = async (
  values: z.infer<typeof SignupFormSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = SignupFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const session = await currentSession();
  try {
    const response = await fetchWrapper.post({
      url: `/auth/signup`,
      body: values,
    });
    if (response.status) {
      redirect("/home");
    }
    return response;
  } catch (error) {
    throw error;
  }
  // finally {
  //   redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT)
  // }
};
