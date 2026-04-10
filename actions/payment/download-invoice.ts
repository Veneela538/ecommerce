"use server";
import { auth } from "@/auth";
import { env } from "@/lib/env";

const downloadInvoice = async (orderId: string) => {
  const session = await auth();

  const response = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_APP_URL}/user/order/${orderId}/invoice`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Downloading invoice failed");
  }

  // 👇 return PDF binary
  return response.arrayBuffer();
};

export default downloadInvoice;
