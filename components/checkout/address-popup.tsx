"use client";

import { createAddress } from "@/actions/address/create-address";
import { refreshAddress } from "@/actions/address/refresh-address";
import { updateAddress } from "@/actions/address/update-address";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList } from "@/config/lov";
import { useDictionary } from "@/context/dictionary-context";
import { AddressFormSchema } from "@/schemas/address-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CardWrapper } from "../auth/card-wrapper";
import { FormError } from "../form-error";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";

type Props = {
  open: boolean;
  onClose: () => void;
  isNewAddress: boolean;
  addressId?: number;
  variantId: number;
};

export default function AddressPopup({
  open,
  onClose,
  isNewAddress,
  addressId = 0,
  variantId,
}: Props) {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const dict = useDictionary();
  const form = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      country: "",
      name: "",
      phoneNumber: "",
      alternativePhoneNumber: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
    },
  });

  function onSubmit(values: z.infer<typeof AddressFormSchema>, id: number) {
    setError("");

    startTransition(() => {
      if (isNewAddress) {
        createAddress(values)
          .then(() => {
            toast.success(dict.crud.success.create);
            form.reset();
            onClose();
          })
          .catch(() => setError(dict.crud.error.create));
      } else {
        const details = {
          ...values,
          addressLine2: values.addressLine2 ?? "",
          addressLine3: values.addressLine3 ?? "",
          id: id,
        };
        updateAddress(details)
          .then(() => {
            toast.success(dict.crud.success.update);
            form.reset();
            refreshAddress();
            onClose();
          })
          .catch(() => setError(dict.common.somethingWentWrong));
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-transparent border-0 shadow-none justify-center max-w-[95vw] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative  w-full max-w-md pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                onClose();
                form.reset();
              }}
              className="absolute top-3 right-3"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardWrapper
              headerLabel={isNewAddress ? "Add New Address1" : "Edit Address"}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    onSubmit(values, addressId)
                  )}
                  className="space-y-6"
                  id="form"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.country}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryList.map((v, i) => (
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
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.name}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Name"
                              type="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.phoneNumber}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Phone number"
                              type="phoneNumber"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alternativePhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.phoneNumber}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Phone number"
                              type="phoneNumber"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.pincode}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Pincode"
                              type="pincode"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.addressLine1}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Address Line 1"
                              type="addressLine1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.addressLine2}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Address Line 2"
                              type="addressLine2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.addressLine3}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter Address Line 3"
                              type="addressLine3"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.city}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter City"
                              type="city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.address.state}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter State"
                              type="state"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
                <div className="mt-8 flex flex-col items-center gap-4">
                  {error && (
                    <div className="w-full flex justify-center">
                      <FormError message={error} />
                    </div>
                  )}
                  <div className="flex flex-row justify-center w-full">
                    <Button
                      type="submit"
                      form="form"
                      className="w-full"
                      disabled={isPending}
                    >
                      Use Address
                    </Button>
                  </div>
                </div>
              </Form>
            </CardWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
