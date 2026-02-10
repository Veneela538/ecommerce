"use client";
import { useCheckout } from "@/context/checkout";
import { AddressResponseType } from "@/types";
import Addresses from "./addresses";

type CheckoutAddressesType = {
  addressListResponse: AddressResponseType[];
};

const CheckoutAddress = ({ addressListResponse }: CheckoutAddressesType) => {
  const checkout = useCheckout();

  return (
    <>
      <Addresses
        addressListResponse={addressListResponse}
        addressType="delivery"
      />
      {!checkout?.isBillingSameAsShipping && (
        <Addresses
          addressListResponse={addressListResponse}
          addressType="billing"
        />
      )}
    </>
  );
};

export default CheckoutAddress;
