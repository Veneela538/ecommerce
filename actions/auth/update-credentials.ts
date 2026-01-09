import { fetchWrapper } from "@/lib/fetch";
import { UpdateCredentialsSchema } from "@/schemas/update-credentials";
import z from "zod";

export const updateCredentials = async (
  values: z.infer<typeof UpdateCredentialsSchema>,
  token: string | null,
  callbackUrl?: string | null
) => {
  const validatedFields = UpdateCredentialsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const { username, password, confirmPassword } = validatedFields.data;

  try {
    return await fetchWrapper.post({
      url: `/auth/verify-email`,
      body: {
        username: username,
        password: password,
        token: token,
      },
      accessToken: undefined,
    });
  } catch (error) {
    throw error;
  }
  // finally {
  //   redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT)
  // }
};
