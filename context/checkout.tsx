"use client";

import { AddressResponseType, PaymentMethod } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type CheckoutContextType = {
  deliveryAddress: AddressResponseType | null;
  setDeliveryAddress: (data: AddressResponseType | null) => void;
  billingAddress: AddressResponseType | null;
  setBillingAddress: (data: AddressResponseType | null) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (data: PaymentMethod | null) => void;
  isBillingSameAsShipping: boolean;
  setIsBillingSameAsShipping: (val: boolean) => void;
  stage: "delivery" | "billing" | "payment" | "review";
  setStage: (data: "delivery" | "billing" | "payment" | "review") => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  singleOrderQuantity: number;
  setSingleOrderQuantity: (val: number) => void;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const CheckoutProvider = ({
  children,
  deliveryAddressValue,
  billingAddressValue,
  paymentMethodValue,
  singleOrderQuantityValue,
}: {
  children: ReactNode;
  deliveryAddressValue: AddressResponseType | null;
  billingAddressValue: AddressResponseType | null;
  paymentMethodValue: PaymentMethod | null;
  singleOrderQuantityValue?: number;
}) => {
  const [deliveryAddress, setDeliveryAddress] =
    useState<AddressResponseType | null>(deliveryAddressValue);
  const [billingAddress, setBillingAddress] =
    useState<AddressResponseType | null>(billingAddressValue);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    paymentMethodValue,
  );
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  const [stage, setStage] = useState<
    "delivery" | "billing" | "payment" | "review"
  >("delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [singleOrderQuantity, setSingleOrderQuantity] = useState(
    singleOrderQuantityValue ?? 1,
  );

  return (
    <CheckoutContext.Provider
      value={{
        deliveryAddress,
        setDeliveryAddress,
        billingAddress,
        setBillingAddress,
        paymentMethod,
        setPaymentMethod,
        isBillingSameAsShipping,
        setIsBillingSameAsShipping,
        stage,
        setStage,
        isProcessing,
        setIsProcessing,
        singleOrderQuantity,
        setSingleOrderQuantity,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const checkout = useContext(CheckoutContext);
  if (checkout == null) {
    throw new Error("must be used within checkoutprovider");
  }
  return checkout;
};
