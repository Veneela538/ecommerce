"use client";
import { addToCartAndSavedForLater } from "@/actions/cart/add_to_cart_and_save_for_later";
import { savedForLater } from "@/actions/cart/save_for_later";
import { singleOrderCheckout } from "@/actions/order/checkout";
import { orderCheckout } from "@/actions/order/multiple-order-checkout";
import Addresses from "@/components/checkout/addresses";
import CheckoutHeader from "@/components/checkout/header";
import Payment from "@/components/checkout/payment";
import ReviewItems from "@/components/checkout/review";
import { useDictionary } from "@/context/dictionary-context";
import { AddressResponseType, CheckoutItem, PaymentMethod } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
  items: CheckoutItem[];
  addressResponse: AddressResponseType[];
  variantId?: number;
};

const CheckoutLayout = ({ items, addressResponse, variantId = 0 }: Props) => {
  const dict = useDictionary();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<
    "address" | "payment" | "review"
  >("address");

  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseType | null>(
      addressResponse.length > 0 ? addressResponse[0] : null,
    );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const [billingAddress, setBillingAddress] =
    useState<AddressResponseType | null>(
      addressResponse.length > 0 ? addressResponse[0] : null,
    );

  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);

  const [isDeletingItem, setIsDeletingItem] = useState(false);

  useEffect(() => {
    if (!selectedAddress && addressResponse.length > 0) {
      setSelectedAddress(addressResponse[0]);
    }
  }, [addressResponse, selectedAddress]);

  const handleAddressDeliver = useCallback(() => {
    if (!selectedAddress) return;
    setActiveStep("payment");
  }, [selectedAddress]);

  const handleUsePayment = useCallback(() => {
    if (!paymentMethod) return;
    setActiveStep("review");
  }, [paymentMethod]);

  const handleRemoveItem = async (id: number, quantity: number) => {
    try {
      setIsDeletingItem(true);
      if (id === 0) {
        await addToCartAndSavedForLater(id, quantity);
      }
      await savedForLater(id, true);
    } finally {
      setIsDeletingItem(false);
    }
    if (items.length == 1) router.push("/cart");
  };

  function checkout() {
    startTransition(async () => {
      const isSingleOrderCheckout = variantId != 0;
      const address = [
        selectedAddress?.addressLine1,
        selectedAddress?.addressLine2,
        selectedAddress?.addressLine3,
        selectedAddress?.city,
        selectedAddress?.state,
        selectedAddress?.pincode,
      ]
        .filter(Boolean)
        .join(", ");
      let shippingAddress = null;
      if (!isBillingSameAsShipping) {
        console.log(billingAddress);
        shippingAddress = [
          billingAddress?.addressLine1,
          billingAddress?.addressLine2,
          billingAddress?.addressLine3,
          billingAddress?.city,
          billingAddress?.state,
          billingAddress?.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      } else {
        shippingAddress = address;
      }
      const values = {
        shippingAddress: String(address),
        billingAddress: String(shippingAddress),
        paymentMethod: String(paymentMethod),
      };
      try {
        if (isSingleOrderCheckout) {
          console.log(values);
          await singleOrderCheckout(variantId, values);
        } else {
          await orderCheckout(values);
        }
      } catch (err) {
        throw new Error("Checkout failed, Something went wrong");
      }
    });
  }

  return (
    <div>
      <CheckoutHeader />

      <div className="grid grid-cols-5">
        <div className="col-span-3 flex flex-wrap gap-4">
          <Addresses
            addressListResponse={addressResponse}
            isOpen={activeStep === "address"}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            isBillingSame={isBillingSameAsShipping}
            setIsBillingSameAsShipping={setIsBillingSameAsShipping}
            addressType="shipping"
            onDeliver={() => {
              if (!selectedAddress) return;
              setActiveStep("payment");
            }}
            onChange={() => setActiveStep("address")}
          />
          {!isBillingSameAsShipping && activeStep === "address" && (
            <Addresses
              addressListResponse={addressResponse}
              isOpen={activeStep === "address"}
              billingAddress={billingAddress}
              setBillingAddress={setBillingAddress}
              addressType="billing"
              onChange={() => setActiveStep("address")}
            />
          )}
          <Payment
            isOpen={activeStep === "payment"}
            selectedPaymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onUsePayment={() => {
              if (!paymentMethod) return;
              setActiveStep("review");
            }}
            onChange={() => setActiveStep("payment")}
          />
          <ReviewItems
            items={items}
            isOpen={activeStep === "review"}
            onChange={() => setActiveStep("review")}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <div className="col-span-2">
          <Card className="flex flex-col m-4">
            <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
              {activeStep === "address" && (
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!selectedAddress) return;
                    setActiveStep("payment");
                  }}
                >
                  Deliver to this address
                </Button>
              )}

              {activeStep === "payment" && (
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!paymentMethod) return;
                    setActiveStep("review");
                  }}
                >
                  Use this payment method
                </Button>
              )}

              {activeStep === "review" && (
                <Button
                  className="w-full"
                  onClick={checkout}
                  disabled={isPending || isDeletingItem}
                >
                  {isDeletingItem ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Updating items...{" "}
                    </>
                  ) : isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      {dict.common.pleaseWait}
                    </>
                  ) : (
                    <p>Pay with {paymentMethod}</p>
                  )}
                </Button>
              )}
              {/* <hr />
              <div className="justify-between">
                <p>items:</p>
                <p></p>
              </div> */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
