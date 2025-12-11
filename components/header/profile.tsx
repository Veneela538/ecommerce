"use client";
import { getUserDetails } from "@/actions/get-user-details";
import { title } from "@/config/lov";
import { useDictionary } from "@/context/dictionary-context";
import { ProfileFormSchema } from "@/schemas/profile-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Profile = () => {
  const dict = useDictionary();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [isCancelling, setIsCancelling] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<z.infer<typeof ProfileFormSchema>>();

  const profileForm = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      pincode: "",
    },
  });

  useEffect(() => {
    const userDetails = async () => {
      try {
        const { data } = await getUserDetails();
        setOriginalValues(data);

        profileForm.reset({
          title: data.title || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          addressLine3: data.addressLine3 || "",
          pincode: data.pincode || "",
        });
      } catch (error) {
        setError(dict.common.somethingWentWrong);
        console.error("Error getting user details:", error);
      }
    };
    userDetails();
  }, [profileForm]);
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex min-h-screen items-center">
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle>
              <Heading variant={"h2"} className="text-center sm:text-center">
                {dict.profile.header}
              </Heading>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                // onSubmit={profileForm.handleSubmit(onSubmit)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-secondary"
                id="profileForm"
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    control={profileForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormLabel>{dict.profile.title}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
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
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.firstName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
                            placeholder="Enter first name"
                            type="firstName"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.lastName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
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
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.phoneNumber}</FormLabel>
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
                              disabled={isPending || !isEditing}
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
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.email}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
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
                    control={profileForm.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.addressLine1}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
                            placeholder="Enter address details"
                            type="address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.addressLine2}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
                            placeholder="Enter address details"
                            type="address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="addressLine3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.addressLine3}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
                            placeholder="Enter address details"
                            type="address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.profile.pincode}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending || !isEditing}
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
                <div className="flex flex-row justify-between w-full">
                  {/* <div> */}
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {dict.profile.buttonLabel3}
                    </Button>
                  ) : (
                    <div className="justify-between">
                      <Button
                        disabled={isPending}
                        type="submit"
                        form="profileForm"
                      >
                        {isPending ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            {dict.common.pleaseWait}
                          </>
                        ) : (
                          <>{dict.profile.buttonLabel1}</>
                        )}
                      </Button>
                      <Button disabled={isCancelling || isPending}>
                        {isCancelling ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            {dict.common.pleaseWait}
                          </>
                        ) : (
                          <>{dict.profile.buttonLabel2}</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
