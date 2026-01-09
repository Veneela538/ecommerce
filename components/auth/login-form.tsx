"use client";

import { googleLogin, login } from "@/actions/auth/login";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/context/dictionary-context";
import { env } from "@/lib/env";
import { LoginFormSchema } from "@/schemas/login-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import { z } from "zod";
import { CardWrapper } from "./card-wrapper";

const LoginForm = ({ inDialog = false }) => {
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string | undefined>("");
  const [isLoginPending, startLoginTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setError("");
    startLoginTransition(() => {
      login(values, callbackUrl)
        .then(() => {
          window.location.assign(callbackUrl ?? "/home");
        })
        .catch(() => setError("Something went wrong"));
    });
  }

  function googleSignin() {
    setError("");
    startGoogleTransition(() => {
      window.location.href = `${env.NEXT_PUBLIC_BACKEND_APP_URL}/oauth2/authorization/google`;
    });
  }

  useEffect(() => {
    if (!searchParams.get("authcode")) return;
    startGoogleTransition(() => {
      googleLogin(searchParams.get("authcode"), callbackUrl);
    });
  }, [callbackUrl, searchParams]);

  return (
    <div
      className={
        inDialog ? "w-full" : "flex min-h-screen items-center justify-center"
      }
    >
      {/* //<div className="w-full"> */}
      <CardWrapper headerLabel={dict.auth.login.header}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.auth.login.username}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoginPending}
                        placeholder="john.doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.auth.login.password}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoginPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Button
              disabled={isLoginPending || isGooglePending}
              type="submit"
              className="w-full"
            >
              {isLoginPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {dict.common.pleaseWait}
                </>
              ) : (
                <>{dict.auth.login.buttonLabel}</>
              )}
            </Button>
            <Button
              disabled={isGooglePending || isLoginPending}
              className="w-full"
              onClick={googleSignin}
            >
              {isGooglePending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {dict.common.pleaseWait}
                </>
              ) : (
                <>
                  <SiGoogle className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </Button>
            <h1>
              Don’t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:underline ml-1"
              >
                Signup
              </Link>
            </h1>
            <h1>
              <Link
                href="/auth/login/forgot-password"
                className="text-blue-600 hover:underline ml-1"
              >
                Forgot Password?
              </Link>
            </h1>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
