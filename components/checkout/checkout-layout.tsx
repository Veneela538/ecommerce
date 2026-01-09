import Addresses from "@/components/checkout/addresses";
import CheckoutHeader from "@/components/checkout/header";
import Payment from "@/components/checkout/payment";
import ReviewItems from "@/components/checkout/review";
import { AddressResponseType, CheckoutItem } from "@/types";

type Props = {
  items: CheckoutItem[];
  addressResponse: AddressResponseType[];
  variantId?: number;
};

const CheckoutLayout = ({ items, addressResponse, variantId = 0 }: Props) => {
  return (
    <div>
      <CheckoutHeader />

      <div className="grid grid-cols-5">
        <div className="col-span-3 flex flex-wrap gap-4">
          <Addresses
            addressListResponse={addressResponse}
            variantId={variantId}
          />
          <Payment />
          <ReviewItems items={items} />
        </div>

        <div className="col-span-2"></div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
