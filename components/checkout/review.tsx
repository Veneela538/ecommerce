"use client";
import { CheckoutItem } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import CheckoutProduct from "./checkout-product";

type Props = {
  items: CheckoutItem[];
  isOpen: boolean;
  onChange: () => void;
  onRemoveItem: (id: number, quantity: number) => void;
};

const ReviewItems = ({ items, isOpen, onChange, onRemoveItem }: Props) => {
  const router = useRouter();
  return (
    <>
      {!isOpen && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Review items and shipping</h2>
              <Button
                variant="link"
                className="p-0 text-sm text-blue-800 hover:underline font-normal"
                onClick={onChange}
              >
                Change
              </Button>
            </div>
          </div>
        </Card>
      )}
      {isOpen && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">Review items and shipping</h2>
            {items.map((item) => (
              <CheckoutProduct
                key={item.variantId}
                product={item}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default ReviewItems;
