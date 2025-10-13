"use client";
import { signup } from "@/actions/signup";
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
import { CredentialsFormSchema, SignupFormSchema } from "@/schemas/signup-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import z from "zod";
import { FormError } from "../form-error";
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

  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [step, setStep] = useState(false);

  const signupForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      addressLane1: "",
      addressLane2: "",
      addressLane3: "",
      addressLane4: "",
      pincode: "",
    },
  });

  const credentialsForm = useForm<z.infer<typeof CredentialsFormSchema>>({
    resolver: zodResolver(CredentialsFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (step) {
      const email = signupForm.getValues("email");
      const currentUsername = credentialsForm.getValues("username");

      // Only auto-fill if username is empty
      if (email && !currentUsername) {
        credentialsForm.setValue("username", email);
      }
    }
  }, [step, signupForm, credentialsForm]);

  function onSubmit(values: z.infer<typeof CredentialsFormSchema>) {
    setError("");

    startTransition(() => {
      if (values.password != values.confirmPassword) {
        setError("Password and Confirm Password do not match.");
        return;
      }
      const data1 = signupForm.getValues(); // get first form values
      const fullData = { ...data1, ...values }; // merge both

      console.log(fullData);

      signup(fullData, callbackUrl)
        .then((data) => {
          if (data?.error) {
            signupForm.reset();
            setError(data?.error?.toString() || undefined);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  }

  function handleNext(values: z.infer<typeof SignupFormSchema>) {
    // Validate first form before going to next
    signupForm.handleSubmit(() => setStep(true))();
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
            {!step && (
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(handleNext)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-secondary"
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

                  <div className="flex flex-col gap-4">
                    <FormField
                      control={signupForm.control}
                      name="addressLane1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.addressLane1}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter address details"
                              type="address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="addressLane2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.addressLane2}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter address details"
                              type="address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="addressLane3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.addressLane3}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter address details"
                              type="address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="addressLane4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.addressLane4}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter address details"
                              type="address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.pincode}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter pincode"
                              type="pincode"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Error message centered */}
                  {error && (
                    <div className="w-full flex justify-center">
                      <FormError message={error} />
                    </div>
                  )}
                  <div className="flex flex-row justify-between w-full px-">
                    {/* <div> */}
                    <Button
                      disabled={isGooglePending || isPending}
                      onClick={googleSignup}
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
                    {/* </div> */}
                    {/* <div> */}
                    {/* <FormError message={error} /> */}
                    <Button
                      disabled={isPending}
                      type="submit"
                      form="signupForm"
                    >
                      {dict.auth.signup.buttonLabel1}
                    </Button>
                    {/* </div> */}
                  </div>
                </div>
                <div className="flex justify-center my-4">
                  Already have an account?
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Login
                  </Link>
                </div>
              </Form>
            )}
            {step && (
              <Form {...credentialsForm}>
                <form
                  onSubmit={credentialsForm.handleSubmit(onSubmit)}
                  className="grid w-[300px] sm:w-[250px] md:w-[400px] border-secondary"
                  id="credentialsForm"
                >
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={credentialsForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.username}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="john.doe"
                              defaultValue={signupForm.getValues("email")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={credentialsForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.auth.signup.password}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="******"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={credentialsForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {dict.auth.signup.confirmPassword}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="******"
                              type="confirmPassword"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Error message centered */}
                  {error && (
                    <div className="w-full flex justify-center">
                      <div className="max-w-md w-full px-4">
                        <FormError message={error} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-row justify-between w-full px-4">
                    {/* <div className="flex flex-col items-center"> */}
                    <Button
                      disabled={isGooglePending || isPending}
                      onClick={() => setStep(false)}
                    >
                      previous
                    </Button>
                    {/* </div> */}
                    {/* <div className="flex flex-col items-center"> */}
                    <Button
                      disabled={isPending}
                      type="submit"
                      form="credentialsForm"
                    >
                      {isPending ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          {dict.common.pleaseWait}
                        </>
                      ) : (
                        <>{dict.auth.signup.buttonLabel2}</>
                      )}
                    </Button>
                    {/* </div> */}
                  </div>
                </div>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;
