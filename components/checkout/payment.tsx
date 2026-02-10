"use client";
import { useCheckout } from "@/context/checkout";
import { useDictionary } from "@/context/dictionary-context";
import { PaymentMethod } from "@/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const Payment = () => {
  const dict = useDictionary();
  const checkbox = useCheckout();
  const open = checkbox?.stage == "payment";
  return (
    <>
      {!open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={() => {
                  checkbox?.setStage("payment");
                }}
              >
                {dict.checkout.change}
              </Button>
            </div>

            <p className="text-sm text-blue-800">
              {dict.checkout.payment.description}
            </p>
          </div>
        </Card>
      )}

      {open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">Payment Method</h2>

            <RadioGroup
              value={checkbox?.paymentMethod ?? undefined}
              onValueChange={(value) =>
                checkbox?.setPaymentMethod(value as PaymentMethod)
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="UPI" id="upi" />
                <Label htmlFor="upi">
                  {dict.checkout.payment.paymentMethods.scanAndPayWithUPI}
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="CARD" id="card" />
                <Label htmlFor="card">
                  {dict.checkout.payment.paymentMethods.creditOrDebitCard}
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="NET_BANKING" id="net-banking" />
                <Label htmlFor="net-banking">
                  {dict.checkout.payment.paymentMethods.netBanking}
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="WALLET" id="wallet" />
                <Label htmlFor="wallet">
                  {dict.checkout.payment.paymentMethods.wallet}
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">
                  {dict.checkout.payment.paymentMethods.cashOrPayOnDelivery}
                </Label>
              </div>
            </RadioGroup>
            <Button
              className="w-64"
              disabled={!checkbox?.paymentMethod}
              onClick={() =>
                checkbox?.paymentMethod != null && checkbox.setStage("review")
              }
            >
              {dict.checkout.payment.submit}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default Payment;
