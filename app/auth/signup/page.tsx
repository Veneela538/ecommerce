import SignupForm from "@/components/auth/signup-form";
import { Suspense } from "react";

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
