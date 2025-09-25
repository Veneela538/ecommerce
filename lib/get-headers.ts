"use server";

import { headers } from "next/headers";

export async function getClientHeader() {
  const XRealIP = (await headers()).get("X-Real-IP");
  const xForwardedFor = (await headers()).get("X-Forwarded-For");
  const XForwardedProto = (await headers()).get("X-Forwarded-Proto");

  return {
    "X-Real-IP": XRealIP ?? "Not Found",
    "X-Forwarded-For": xForwardedFor
      ? xForwardedFor.split(",")[0]
      : "Not Found",
    "X-Forwarded-Proto": XForwardedProto ?? "Not Found",
  };
}
