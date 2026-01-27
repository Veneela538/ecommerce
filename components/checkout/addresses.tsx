"use client";
import { deleteAddress } from "@/actions/address/delete-address";
import { refreshAddress } from "@/actions/address/refresh-address";
import { useDictionary } from "@/context/dictionary-context";
import { AddressResponseType } from "@/types";
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
  isOpen: boolean;
  selectedAddress?: AddressResponseType | null;
  setSelectedAddress?: (address: AddressResponseType | null) => void;
  billingAddress?: AddressResponseType | null;
  setBillingAddress?: (address: AddressResponseType | null) => void;
  isBillingSame?: boolean;
  setIsBillingSameAsShipping?: (value: boolean) => void;
  addressType: "billing" | "shipping";
  onDeliver?: () => void;
  onChange: () => void;
};

const Addresses = ({
  addressListResponse,
  isOpen,
  selectedAddress,
  setSelectedAddress,
  billingAddress,
  setBillingAddress,
  isBillingSame,
  setIsBillingSameAsShipping,
  addressType,
  onDeliver,
  onChange,
}: AddressesType) => {
  const dict = useDictionary();

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
      {isOpen && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">
              {dict.address.addressTitle}{" "}
              {addressType == "shipping"
                ? dict.address.shippingAddress
                : dict.address.billingAddress}
            </h2>
            <hr />
            <h2 className="text-xl font-bold">
              Delivery addresses({addressListResponse.length})
            </h2>
            {addressListResponse.length > 0 && (
              <RadioGroup
                value={
                  addressType == "shipping"
                    ? String(selectedAddress?.id)
                    : String(billingAddress?.id)
                }
                onValueChange={(value) => {
                  const addr = addressListResponse.find(
                    (a) => String(a.id) === value,
                  );
                  if (addr && addressType == "shipping") {
                    setSelectedAddress?.(addr);
                  } else if (addr && addressType == "billing") {
                    setBillingAddress?.(addr);
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
                        <p>Phone number: {address?.phoneNumber}</p>
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
            {addressType == "shipping" && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sameAddress"
                    checked={isBillingSame}
                    onCheckedChange={(checked) => {
                      const value = Boolean(checked);
                      setIsBillingSameAsShipping?.(value);
                    }}
                  />
                  <label
                    htmlFor="sameAddress"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Billing address same as shipping
                  </label>
                </div>
                <Button
                  className="rounded w-40"
                  type="button"
                  onClick={onDeliver}
                  disabled={!selectedAddress}
                >
                  Deliver to this address
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      {!isOpen && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Delivering to {selectedAddress?.name}
              </h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={onChange}
              >
                Change
              </Button>
            </div>
            <p className="text-sm">
              {selectedAddress ? formatAddress(selectedAddress) : null}
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default Addresses;
