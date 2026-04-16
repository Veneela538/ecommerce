"use client";
import { login } from "@/actions/auth/login";
import { updateCredentials } from "@/actions/auth/update-credentials";
import { CardWrapper } from "@/components/auth/card-wrapper";
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
import { UpdateCredentialsSchema } from "@/schemas/update-credentials";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type LoginFormData = {
  username: string;
  password: string;
};

const UpdateCredentials = () => {
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | undefined>("");
  const [isSubmitPending, startSubmitTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateCredentialsSchema>>({
    resolver: zodResolver(UpdateCredentialsSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof UpdateCredentialsSchema>) {
    setError("");
    const token = searchParams.get("token");
    // if (!token) {
    //   setError("Token Expired!");
    //   return;
    // }
    startSubmitTransition(async () => {
      updateCredentials(values, token)
        .then(async () => {
          const loginData: LoginFormData = {
            username: values.username,
            password: values.password,
          };
          await login(loginData).catch(() => {
            setError(dict.common.somethingWentWrong);
          });
          window.location.assign("/home");
        })
        .catch(() => {
          setError(dict.common.somethingWentWrong);
        });
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <CardWrapper headerLabel={dict.auth.login.updateCredentials.header}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dict.auth.login.updateCredentials.username}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john.doe"
                        disabled={isSubmitPending}
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
                    <FormLabel>
                      {dict.auth.login.updateCredentials.password}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isSubmitPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dict.auth.login.updateCredentials.confirmPassword}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isSubmitPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={isSubmitPending}>
              {dict.auth.login.updateCredentials.submit}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default UpdateCredentials;
