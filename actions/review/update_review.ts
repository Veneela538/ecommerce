"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";
import { ReviewFormSchema } from "@/schemas/review-form";
import z from "zod";

export const updateReview = async (
  variantAsin: string,
  values: z.infer<typeof ReviewFormSchema>,
) => {
  const session = await auth();
  const validatedFields = ReviewFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!" };
  }
  try {
    return await fetchWrapper.post({
      url: `/user/review`,
      accessToken: session?.accessToken,
      body: { ...values, variantAsin: variantAsin },
    });
  } catch (error) {
    throw error;
  }
};
