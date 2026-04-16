"use client";
import { deleteAddress } from "@/actions/address/delete-address";
import { refreshAddress } from "@/actions/address/refresh-address";
import { updateUserDetails } from "@/actions/user-details/update-user-details";
import { title } from "@/config/lov";
import { useDictionary } from "@/context/dictionary-context";
import { ProfileFormSchema } from "@/schemas/profile-form";
import { AddressResponseType, UserDetailsResponseType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import EditAddressPopup from "../checkout/edit-address";
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ProfileType = {
  userDetailsResponse: UserDetailsResponseType;
  addresses: AddressResponseType[];
};

const Profile = ({ userDetailsResponse, addresses }: ProfileType) => {
  const dict = useDictionary();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      title: userDetailsResponse.title || "",
      firstName: userDetailsResponse.firstName || "",
      lastName: userDetailsResponse.lastName || "",
      phoneNumber: userDetailsResponse.phoneNumber || "",
      email: userDetailsResponse.email || "",
    },
  });

  function onSubmit(values: z.infer<typeof ProfileFormSchema>) {
    setError("");

    startTransition(() => {
      updateUserDetails(values)
        .then(() => toast.success(dict.crud.success.update))
        .catch(() => setError(dict.common.somethingWentWrong));
      setIsEditing(false);
    });
  }

  const formatAddress = (address?: AddressResponseType): string => {
    if (!address) return "";

    return [
      address.addressLine1,
      address.addressLine2,
      address.addressLine3,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };
  const removeAddress = (addressId: number) => {
    deleteAddress(addressId)
      .then(() => {
        toast.success(dict.crud.success.delete);
        refreshAddress();
      })
      .catch(() => {
        throw new Error(dict.common.somethingWentWrong);
      });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex min-h-screen items-center">
        <Card className="w-full">
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
                onSubmit={profileForm.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 border-secondary"
                id="profileForm"
              >
                <fieldset disabled={isPending || !isEditing}>
                  <div className="flex flex-row gap-10">
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
                                  pattern="[0-9]*"
                                  maxLength={10}
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
                    {addresses.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <Heading variant={"h3"} className="text-lg font-medium">
                          Addresses
                        </Heading>

                        {addresses.map((address) => (
                          <li key={address.id} className="ml-4">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`address-${address.id}`}>
                                <div className="space-y-2">
                                  <p className="font-semibold">
                                    {address.name}
                                  </p>

                                  <p className="text-sm text-muted-foreground">
                                    {formatAddress(address)}
                                  </p>

                                  <p className="text-sm">
                                    <span className="font-medium">
                                      {dict.checkout.address.phoneNumber}
                                    </span>
                                    {address.phoneNumber}
                                  </p>

                                  {isEditing && (
                                    <>
                                      <EditAddressPopup address={address} />
                                      <Button
                                        variant="link"
                                        className="pl-4 h-auto text-sm text-blue-800 hover:underline font-normal"
                                        onClick={() =>
                                          removeAddress(address?.id)
                                        }
                                      >
                                        {dict.address.removeAddress}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </Label>
                            </div>
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                </fieldset>
              </form>
              <div className="mt-8 flex flex-col items-center gap-4">
                {error && (
                  <div className="w-full flex justify-center">
                    <FormError message={error} />
                  </div>
                )}
                <div className="flex flex-row justify-between w-full">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {dict.profile.buttonLabel3}
                    </Button>
                  ) : (
                    <div className="flex justify-between w-full">
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
                      <Button
                        disabled={isPending}
                        onClick={() => {
                          setIsEditing(false);
                        }}
                      >
                        {isPending ? (
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
