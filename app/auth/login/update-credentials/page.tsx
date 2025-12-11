import UpdateCredentials from "@/components/auth/update-credentials";
import { Suspense } from "react";

export default async function updateCredentials() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateCredentials />
    </Suspense>
  );
}
