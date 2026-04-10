"use client";
import { singleOrderCheckout } from "@/actions/order/checkout";
import { orderCheckout } from "@/actions/order/multiple-order-checkout";
import { useCheckout } from "@/context/checkout";
import { useDictionary } from "@/context/dictionary-context";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type CheckoutSubmitButtonType = {
  variantAsin?: string;
};

const CheckoutSubmitButton = ({ variantAsin }: CheckoutSubmitButtonType) => {
  const dict = useDictionary();
  const checkout = useCheckout();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function submitCheckout() {
    startTransition(async () => {
      const isSingleOrderCheckout = !!variantAsin;
      const address = [
        checkout?.deliveryAddress?.addressLine1,
        checkout?.deliveryAddress?.addressLine2,
        checkout?.deliveryAddress?.addressLine3,
        checkout?.deliveryAddress?.city,
        checkout?.deliveryAddress?.state,
        checkout?.deliveryAddress?.pincode,
      ]
        .filter(Boolean)
        .join(", ");
      let shippingAddress = null;
      if (!checkout?.isBillingSameAsShipping) {
        shippingAddress = [
          checkout?.billingAddress?.addressLine1,
          checkout?.billingAddress?.addressLine2,
          checkout?.billingAddress?.addressLine3,
          checkout?.billingAddress?.city,
          checkout?.billingAddress?.state,
          checkout?.billingAddress?.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      } else {
        shippingAddress = address;
      }
      const values = {
        shippingAddress: String(address),
        billingAddress: String(shippingAddress),
        paymentMethod: String(checkout?.paymentMethod),
      };
      try {
        const currentPath = window.location.pathname;
        if (isSingleOrderCheckout) {
          const {
            data: { paymentToken },
          } = await singleOrderCheckout(
            variantAsin,
            values,
            checkout.singleOrderQuantity,
          );
          router.push(
            `/checkout/process-payment/${paymentToken}?callbackUrl=${encodeURIComponent(currentPath)}`,
          );
        } else {
          const {
            data: { paymentToken },
          } = await orderCheckout(values);
          router.push(
            `/checkout/process-payment/${paymentToken}?callbackUrl=${encodeURIComponent(currentPath)}`,
          );
        }
      } catch (err) {
        throw new Error("Checkout failed, Something went wrong");
      }
    });
  }

  const handleCheckoutNext = () => {
    if (!checkout) return;

    if (checkout.stage === "delivery") {
      if (!checkout.deliveryAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      if (!checkout.isBillingSameAsShipping) {
        checkout.setStage("billing");
      } else {
        checkout.setStage("payment");
      }
      return;
    }

    if (checkout.stage === "billing") {
      if (!checkout.billingAddress) {
        toast.error("Please select a billing address");
        return;
      }

      checkout.setStage("payment");
      return;
    }

    if (checkout.stage === "payment") {
      if (!checkout.paymentMethod) {
        toast.error("Please select a payment method");
        return;
      }

      checkout.setStage("review");
      return;
    }

    // review stage
    submitCheckout();
  };

  return (
    <Card className="flex flex-col m-4">
      <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
        {/* {checkout.stage === "address" && (
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
          )} */}

        <Button
          className="w-full"
          onClick={handleCheckoutNext}
          disabled={
            (checkout?.stage == "review" && isPending) || checkout?.isProcessing
          }
        >
          {checkout?.stage == "delivery" ? (
            <p>{dict.checkout.address.deliverToThisAddress}</p>
          ) : checkout?.stage == "billing" ? (
            <p>{dict.checkout.address.deliverToThisBillingAddress}</p>
          ) : checkout?.stage == "payment" ? (
            <p>{dict.checkout.payment.submit}</p>
          ) : (
            <>
              {checkout?.isProcessing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {dict.checkout.updatingItems}
                </>
              ) : isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {dict.common.pleaseWait}
                </>
              ) : (
                <p>
                  {dict.checkout.payWith} {checkout?.paymentMethod}
                </p>
              )}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CheckoutSubmitButton;
