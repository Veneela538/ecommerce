"use client";
import { signup } from "@/actions/auth/signup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { title } from "@/config/lov";
import { useDictionary } from "@/context/dictionary-context";
import { env } from "@/lib/env";
import { SignupFormSchema } from "@/schemas/signup-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import z from "zod";
import { FormError } from "../form-error";
import { FormInfo } from "../form-info";
import { Heading } from "../heading";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const SignupForm = () => {
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [emailStatus, setEmailStatus] = useState<boolean>(false);

  const signupForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    setError("");
    setEmailStatus(false);

    startTransition(() => {
      signup(values, callbackUrl)
        .then((res) => {
          if (res.status === true) {
            setEmailStatus(true);
          }
        })
        .catch(() => setError(dict.common.somethingWentWrong));
    });
  }

  function googleSignup() {
    setError("");
    startGoogleTransition(() => {
      window.location.href = `${env.NEXT_PUBLIC_BACKEND_APP_URL}/oauth2/authorization/google`;
    });
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex min-h-screen items-center">
        <Card>
          <CardHeader>
            <CardTitle>
              <Heading variant={"h2"} className="text-center sm:text-center">
                {dict.auth.signup.header}
              </Heading>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 border-secondary"
                id="signupForm"
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    control={signupForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormLabel>{dict.auth.signup.title}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {title.map((v, i) => (
                              <SelectItem key={i} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.auth.signup.firstName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter first name"
                            type="firstName"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.auth.signup.lastName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter last name"
                            type="lastName"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* </div> */}
                  <FormField
                    control={signupForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.auth.signup.phoneNumber}</FormLabel>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            value={"+91"}
                            readOnly
                            className="w-14"
                          />
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="xxxxxxxxxx"
                              type="phoneNumber"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.auth.signup.email}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter email address"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className="flex flex-col gap-4">
                  
                  
                </div> */}
              </form>
              <div className="mt-8 flex flex-col items-center gap-4">
                {/* Error message centered */}
                {error && (
                  <div className="w-full flex justify-center">
                    <FormError message={error} />
                  </div>
                )}
                {emailStatus && (
                  <div className="w-full flex justify-center">
                    <FormInfo message={dict.auth.signup.emailSent} />
                  </div>
                )}
                <div className="flex flex-col justify-between gap-4 w-full">
                  {/* <div> */}
                  <Button
                    disabled={isPending}
                    type="submit"
                    form="signupForm"
                    className="bg-gray-900"
                  >
                    {isPending ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        {dict.common.pleaseWait}
                      </>
                    ) : (
                      <>{dict.auth.signup.buttonLabel}</>
                    )}
                  </Button>
                  <Button
                    disabled={isGooglePending || isPending}
                    onClick={googleSignup}
                    variant={"outline"}
                  >
                    {isGooglePending ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        {dict.common.pleaseWait}
                      </>
                    ) : (
                      <>
                        <SiGoogle className="w-5 h-5" />
                        {dict.auth.signup.continueWithGoogle}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex justify-center my-4">
                {dict.auth.signup.haveAnAccount}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {dict.auth.signup.login}
                </Link>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;
