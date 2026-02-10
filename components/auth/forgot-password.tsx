"use client";
import verifyEmail from "@/actions/auth/verify-email";
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
import { ForgotpasswordSchema } from "@/schemas/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const ForgotPassword = () => {
  const dict = useDictionary();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const accountCreatedForm = useForm<z.infer<typeof ForgotpasswordSchema>>({
    resolver: zodResolver(ForgotpasswordSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof ForgotpasswordSchema>) {
    setError("");

    startTransition(() => {
      verifyEmail(values.username).catch(() => {
        setError(dict.common.somethingWentWrong);
      });
    });
  }
  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="flex flex-col py-6 w-full max-w-md px-6 justify-center">
        <Form {...accountCreatedForm}>
          <form
            onSubmit={accountCreatedForm.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 border-secondary"
            id="accountCreatedForm"
          >
            <FormField
              control={accountCreatedForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.auth.login.username}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            <div className="flex justify-end">
              <Button disabled={isPending} type="submit">
                {dict.auth.forgotPassword.submit}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
