"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function logout() {
  await signOut().then(() => redirect("/auth/login"));
}
