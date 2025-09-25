"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginFormSchema } from "@/schemas/login-form";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (
  values: z.infer<typeof LoginFormSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const { username, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      // redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: error.cause ?? "Incorrect username or password!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
  // finally {
  //   redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT)
  // }
};
