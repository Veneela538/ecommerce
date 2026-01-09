"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type PaymentMethod = "UPI" | "CARD" | "NET_BANKING" | "COD" | "WALLET";

const Payment = () => {
  const [openPaymentSection, setOpenPaymentSection] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  return (
    <>
      {!openPaymentSection && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={() => setOpenPaymentSection(true)}
              >
                Change
              </Button>
            </div>

            <p className="text-sm text-blue-800">
              Use a gift card, voucher or promo code
            </p>
          </div>
        </Card>
      )}

      {openPaymentSection && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">Payment Method</h2>

            <RadioGroup
              value={paymentMethod ?? ""}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="UPI" id="upi" />
                <Label htmlFor="upi">Scan and Pay with UPI</Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="CARD" id="card" />
                <Label htmlFor="card">Credit / Debit Card</Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="NET_BANKING" id="net-banking" />
                <Label htmlFor="net-banking">Net Banking</Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="WALLET" id="wallet" />
                <Label htmlFor="wallet">Wallet</Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">Cash on Delivery/Pay on Delivery</Label>
              </div>
            </RadioGroup>
            <Button
              className="w-64"
              disabled={!paymentMethod}
              onClick={() => setOpenPaymentSection(false)}
            >
              Use this payment method
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default Payment;
