"use client";

import cancelPayment from "@/actions/payment/cancel-payment";
import payment from "@/actions/payment/payment";
import { useDictionary } from "@/context/dictionary-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Props = {
  token: string;
  price: number;
  paymentExpiresAt: number;
};

export default function PaymentActions({
  token,
  price,
  paymentExpiresAt,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCancelling, startCancelTransition] = useTransition();
  const dict = useDictionary();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [progress, setProgress] = useState(100);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

  useEffect(() => {
    const expiresAtMs = new Date(paymentExpiresAt).getTime();
    const startTime = Date.now();
    const total = expiresAtMs - startTime;

    const interval = setInterval(() => {
      const remainingMs = expiresAtMs - Date.now();

      if (remainingMs <= 0) {
        setTimeLeft("00:00");
        setProgress(0);
        setIsDisabled(true);
        clearInterval(interval);
        router.push(callbackUrl);
        return;
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // format with leading zeros
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      );

      // progress %
      setProgress((remainingMs / total) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [callbackUrl, paymentExpiresAt, router]);

  const handlePayment = async () => {
    setIsDisabled(true); // disable both buttons
    try {
      const {
        data: { orderId },
      } = await payment(token);

      // ✅ show success toast
      toast.success("Payment successful");
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      setIsDisabled(false);
    }
  };

  const handleCancel = async () => {
    setIsDisabled(true); // disable both buttons
    startCancelTransition(async () => {
      try {
        cancelPayment(token).then(() => {
          router.push(callbackUrl);
          toast.error(dict.checkout.payment.paymentCancelled);
        });
      } catch {
        console.error(dict.common.somethingWentWrong);
        setIsDisabled(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <div className={`text-center font-bold text-lg`}>
          Time left: {timeLeft}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 border border-green-700 mt-2 overflow-hidden">
          <div
            className="h-1.5 transition-all duration-1000 bg-green-700"
            style={{ width: `${100 - progress}%` }}
          />
        </div>
        <div className="text-center mt-2">
          Please don’t refresh the page or hit the back button until the
          transaction is complete.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-row justify-between">
        <Button
          onClick={handleCancel}
          disabled={isDisabled}
          className="w-5/12 bg-gray-300 text-black border border-gray-500 py-3 rounded font-semibold disabled:opacity-50"
        >
          {isCancelling ? "Processing..." : "Cancel Payment"}
        </Button>

        <Button
          onClick={handlePayment}
          disabled={isDisabled}
          className="w-5/12 bg-gray-700 text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          {isPending ? "Processing..." : `Pay ₹${price}`}
        </Button>
      </div>
      {/* {isSuccess && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="text-green-700 font-bold text-lg">
            ✅ Payment done successfully
          </div>

          <Button
            onClick={handleDownloadInvoice}
            variant="link"
            className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-end"
          >
            Download Invoice
          </Button>
          <Button
            onClick={() => router.push("/orders")}
            variant="link"
            className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-end"
          >
            View Orders
          </Button>

          <Button
            onClick={() => router.push("/home")}
            variant="link"
            className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-end"
          >
            Back to Home
          </Button>
        </div>
      )} */}
    </div>
  );
}
