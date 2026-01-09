"use server";

import { revalidatePath } from "next/cache";

export const refreshAddress = async (id?: number) => {
  if (id) {
    revalidatePath(`/checkout/${id}`);
  } else {
    revalidatePath("/checkout");
  }
};
