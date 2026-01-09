"use client";
import { AddressResponseType } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import AddressPopup from "./address-popup";

type AddressesType = {
  addressListResponse: AddressResponseType[];
  variantId: number;
};

const Addresses = ({ addressListResponse, variantId }: AddressesType) => {
  const [openAddressPopup, setOpenAddressPopup] = useState(false);
  const [openDeliverySection, setOpenDeliverySection] = useState(true);

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

  return (
    <Card className="flex flex-col w-full m-4">
      <div className="flex flex-col gap-6 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
        <h2 className="text-xl font-bold">Select a delivery address</h2>
        <hr />
        <h2 className="text-xl font-bold">Delivery addresses(1)</h2>
        {addressListResponse.map((address) => (
          <RadioGroup defaultValue="address-one" key={address.id}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="address-one" id="address-one" />
              <Label htmlFor="address-one">
                <div className="space-y-2">
                  <p className="font-bold">{address.name}</p>
                  <p>{formatAddress(address)}</p>
                  <p>Phone number: {address?.phoneNumber}</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setOpenAddressPopup(true)}
                    className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal"
                  >
                    Edit address
                  </Button>
                  <AddressPopup
                    open={openAddressPopup}
                    onClose={() => setOpenAddressPopup(false)}
                    isNewAddress={false}
                    addressId={address.id}
                    variantId={variantId}
                  />
                </div>
              </Label>
            </div>
          </RadioGroup>
        ))}
        <Button
          type="button"
          variant="link"
          onClick={() => setOpenAddressPopup(true)}
          className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-start"
        >
          Add a new delivery address
        </Button>
        <AddressPopup
          open={openAddressPopup}
          onClose={() => setOpenAddressPopup(false)}
          isNewAddress={true}
          variantId={variantId}
        />
        <Button
          className="rounded w-40"
          type="button"
          onClick={() => setOpenDeliverySection(false)}
        >
          Deliver to this address
        </Button>
      </div>
    </Card>
  );
};

export default Addresses;
