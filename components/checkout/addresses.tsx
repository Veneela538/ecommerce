"use client";

import { deleteAddress } from "@/actions/address/delete-address";
import { refreshAddress } from "@/actions/address/refresh-address";
import { useCheckout } from "@/context/checkout";
import { useDictionary } from "@/context/dictionary-context";
import { AddressResponseType } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import AddAddressPopup from "./add-address";
import EditAddressPopup from "./edit-address";

type AddressesType = {
  addressListResponse: AddressResponseType[];
  addressType: "billing" | "delivery";
};

const Addresses = ({ addressListResponse, addressType }: AddressesType) => {
  const dict = useDictionary();
  const checkout = useCheckout();
  const open = checkout?.stage == addressType;

  useEffect(() => {
    if (addressListResponse.length === 0) return;

    if (addressType === "delivery" && checkout?.deliveryAddress == null) {
      checkout?.setDeliveryAddress(addressListResponse[0]);
      if (checkout.isBillingSameAsShipping) {
        checkout?.setBillingAddress(addressListResponse[0]);
      }
    }

    if (addressType === "billing" && checkout?.billingAddress == null) {
      checkout?.setBillingAddress(addressListResponse[0]);
    }
  }, [addressListResponse, addressType, checkout]);

  const formatAddress = (address?: AddressResponseType): string => {
    if (!address) return "";

    return [
      address.addressLine1,
      address.addressLine2,
      address.addressLine3,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const removeAddress = (addressId: number) => {
    deleteAddress(addressId)
      .then(() => {
        toast.success(dict.crud.success.delete);
        refreshAddress();
      })
      .catch(() => {
        throw new Error(dict.common.somethingWentWrong);
      });
  };

  return (
    <>
      {open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">
              {dict.address.addressTitle}{" "}
              {addressType == "delivery"
                ? dict.address.shippingAddress
                : dict.address.billingAddress}
            </h2>
            <hr />
            <h2 className="text-xl font-bold">
              {addressType == "delivery"
                ? dict.address.shippingAddress
                : dict.address.billingAddress}
              ({addressListResponse.length})
            </h2>
            {addressListResponse.length > 0 && (
              <RadioGroup
                value={
                  addressType == "delivery"
                    ? String(checkout?.deliveryAddress?.id)
                    : String(checkout?.billingAddress?.id)
                }
                onValueChange={(value) => {
                  const addr = addressListResponse.find(
                    (a) => String(a.id) === value,
                  );
                  if (addr && addressType == "delivery") {
                    checkout?.setDeliveryAddress(addr);
                  } else if (addr && addressType == "billing") {
                    checkout?.setBillingAddress(addr);
                  }
                }}
                className="space-y-2"
              >
                {addressListResponse.map((address) => (
                  <div className="flex items-center space-x-2" key={address.id}>
                    <RadioGroupItem
                      value={String(address.id)}
                      id={`address-${address.id}`}
                    />
                    <Label htmlFor={`address-${address.id}`}>
                      <div className="space-y-2">
                        <p className="font-bold">{address.name}</p>
                        <p>{formatAddress(address)}</p>
                        <p>
                          {dict.checkout.address.phoneNumber}
                          {address?.phoneNumber}
                        </p>
                        <EditAddressPopup address={address} />
                        <Button
                          variant="link"
                          className="pl-4 h-auto text-sm text-blue-800 hover:underline font-normal"
                          onClick={() => {
                            removeAddress(address?.id);
                          }}
                        >
                          {dict.address.removeAddress}
                        </Button>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            <AddAddressPopup />
            <div className="flex items-center gap-2">
              <Checkbox
                id="sameAddress"
                checked={checkout?.isBillingSameAsShipping}
                onCheckedChange={(checked) => {
                  const value = Boolean(checked);
                  checkout?.setIsBillingSameAsShipping(value);
                }}
              />
              <label
                htmlFor="sameAddress"
                className="text-sm text-gray-600 cursor-pointer"
              >
                {dict.checkout.address.billingSameAsShipping}
              </label>
            </div>
            <Button
              className="rounded w-40"
              type="button"
              disabled={!checkout?.deliveryAddress}
              onClick={() => {
                addressType == "billing"
                  ? checkout?.setStage("payment")
                  : !checkout.isBillingSameAsShipping
                    ? checkout?.setStage("billing")
                    : checkout?.setStage("payment");
              }}
            >
              {dict.checkout.address.deliverToThisAddress}
            </Button>
          </div>
        </Card>
      )}
      {!open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Delivering to {checkout?.deliveryAddress?.name}
              </h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={() => {
                  addressType == "delivery"
                    ? checkout.setStage("delivery")
                    : checkout.setStage("billing");
                }}
              >
                {dict.checkout.change}
              </Button>
            </div>
            <p className="text-sm">
              {checkout?.deliveryAddress
                ? formatAddress(checkout.deliveryAddress)
                : null}
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default Addresses;
