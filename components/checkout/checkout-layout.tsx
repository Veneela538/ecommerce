import CheckoutHeader from "@/components/checkout/checkout-header";
import Payment from "@/components/checkout/payment";
import ReviewItems from "@/components/checkout/review";
import { CheckoutItem } from "@/types";

import { getAddress } from "@/actions/address/get-address";
import { redirect } from "next/navigation";
import CheckoutAddress from "./checkout-address";
import CheckoutSubmitButton from "./checkout-submit-button";

type Props = {
  items: CheckoutItem[];
  variantAsin?: string;
};

const CheckoutLayout = async ({ items, variantAsin }: Props) => {
  const { data: addressResponse } = await getAddress();
  if (items.length == 0) redirect("/cart");

  return (
    <div>
      <CheckoutHeader />

      <div className="grid grid-cols-5">
        <div className="col-span-3 flex flex-wrap gap-4">
          <CheckoutAddress addressListResponse={addressResponse} />
          <Payment />
          <ReviewItems items={items} />
        </div>

        <div className="col-span-2">
          <CheckoutSubmitButton variantAsin={variantAsin} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
