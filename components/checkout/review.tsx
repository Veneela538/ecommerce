"use client";
import { useCheckout } from "@/context/checkout";
import { useDictionary } from "@/context/dictionary-context";
import { CheckoutItem } from "@/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import CheckoutProduct from "./checkout-product";

type Props = {
  items: CheckoutItem[];
};

const ReviewItems = ({ items }: Props) => {
  const dict = useDictionary();
  const checkout = useCheckout();
  const open = checkout?.stage == "review";

  return (
    <>
      {!open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {dict.checkout.reviewItems.title}
              </h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={() => {
                  checkout?.setStage("review");
                }}
              >
                {dict.checkout.change}
              </Button>
            </div>
          </div>
        </Card>
      )}
      {open && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">
              {dict.checkout.reviewItems.title}
            </h2>
            {items.map((item) => (
              <CheckoutProduct key={item.variantAsin} product={item} />
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default ReviewItems;
