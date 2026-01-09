"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoginForm from "./auth/login-form";

type Props = {
  open: boolean;
};

export default function LoginPopup({ open }: Props) {
  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent
          className="
          bg-transparent
          border-0
          shadow-none
          justify-center
          max-w-none
        "
        >
          {/* Screen-reader only title */}
          <AlertDialogTitle className="sr-only">Login</AlertDialogTitle>
          <LoginForm inDialog />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
