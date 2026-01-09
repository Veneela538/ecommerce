"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { ProfileFormSchema } from "@/schemas/profile-form";
import z from "zod";

export const updateUserDetails = async (
  values: z.infer<typeof ProfileFormSchema>
) => {
  const validatedFields = ProfileFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }

  const session = await auth();
  try {
    return await fetchWrapper.patch({
      url: `/user/user-details`,
      accessToken: session?.accessToken,
      body: validatedFields.data,
    });
  } catch (error) {
    throw error;
  }
};
