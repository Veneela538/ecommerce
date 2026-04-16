"use client";

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
import { AddressResponseType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormError } from "../form-error";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

type EditAddressPopupType = {
  address: AddressResponseType | null;
};

export default function EditAddressPopup({ address }: EditAddressPopupType) {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const dict = useDictionary();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      country: address?.country || "",
      name: address?.name || "",
      phoneNumber: String(address?.phoneNumber) || "",
      alternativePhoneNumber: address?.alternativePhoneNumber ?? "",
      pincode: address?.pincode || "",
      addressLine1: address?.addressLine1 || "",
      addressLine2: address?.addressLine2 || "",
      addressLine3: address?.addressLine3 || "",
      city: address?.city || "",
      state: address?.state || "",
    },
  });

  function onSubmit(values: z.infer<typeof AddressFormSchema>) {
    setError("");

    startTransition(() => {
      if (!address?.id) {
        setError("Address id not found");
        return;
      }

      const details = {
        ...values,
        addressLine2: values.addressLine2 ?? "",
        addressLine3: values.addressLine3 ?? "",
        id: Number(address.id),
      };
      updateAddress(details)
        .then(() => {
          toast.success(dict.crud.success.update);
          form.reset();
          refreshAddress();
          setOpen(false);
        })
        .catch(() => setError(dict.common.somethingWentWrong));
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal"
          >
            {dict.address.editAddress}
          </Button>
        </DialogTrigger>
        <DialogContent className="justify-center">
          <DialogTitle>{dict.address.editAddress}</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values))}
              id="form"
            >
              <div className="flex gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.address.country}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                            type="text"
                            inputMode="numeric"
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
                        <FormLabel>
                          {dict.address.alternativePhoneNumber}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter Alternative Phone number"
                            type="text"
                            inputMode="numeric"
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
                </div>
                <div className="space-y-4">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
