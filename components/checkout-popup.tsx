"use client";
import { singleOrderCheckout } from "@/actions/order/checkout";
import { orderCheckout } from "@/actions/order/multiple-order-checkout";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { paymentMethod } from "@/config/lov";
import { useDictionary } from "@/context/dictionary-context";
import { CheckoutFormSchema } from "@/schemas/checkout-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { CardWrapper } from "./auth/card-wrapper";
import { FormError } from "./form-error";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  isSingleOrderCheckout: boolean;
  variantId: number | null;
};

export default function CheckoutPopup({
  open,
  onClose,
  isSingleOrderCheckout,
  variantId,
}: Props) {
  const dict = useDictionary();
  const [error, setError] = useState<string>("");
  const [sameAddress, setSameAddress] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CheckoutFormSchema>>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      paymentMethod: undefined,
      shippingAddress: "",
      billingAddress: "",
    },
  });

  function checkout(values: z.infer<typeof CheckoutFormSchema>) {
    setError("");

    startTransition(async () => {
      try {
        if (isSingleOrderCheckout) {
          if (!variantId) {
            setError("Invalid product selected");
            return;
          }
          await singleOrderCheckout(String(variantId), values, 1);
        } else {
          await orderCheckout(values);
        }
        onClose();
        form.reset();
        setSameAddress(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Checkout failed. Something went wrong",
        );
      }
    });
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={onClose}>
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
          <AlertDialogTitle className="sr-only">Checkout</AlertDialogTitle>
          <div className="relative">
            <Button
              onClick={() => {
                onClose();
                form.reset();
                setSameAddress(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black 
             rounded-full p-1 hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardWrapper headerLabel="Checkout">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(checkout)}
                  className="space-y-6"
                  id="form"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.checkout.paymentMethod}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethod.map((v, i) => (
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
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dict.checkout.shippingAddress}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              disabled={isPending}
                              placeholder="Enter Shipping Address"
                              onChange={(e) => {
                                field.onChange(e);

                                if (sameAddress) {
                                  form.setValue(
                                    "billingAddress",
                                    e.target.value,
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox
                        id="sameAddress"
                        checked={sameAddress}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          setSameAddress(isChecked);

                          if (isChecked) {
                            form.setValue(
                              "billingAddress",
                              form.getValues("shippingAddress"),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor="sameAddress"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Billing address same as shipping
                      </label>
                    </div>
                    {!sameAddress && (
                      <FormField
                        control={form.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {dict.checkout.billingAddress}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                disabled={isPending}
                                placeholder="Enter Billing Address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </form>
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Error message centered */}
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
                      Proceed to checkout
                    </Button>
                  </div>
                </div>
              </Form>
            </CardWrapper>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
