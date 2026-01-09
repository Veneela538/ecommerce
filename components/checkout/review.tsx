"use client";
import { CheckoutItem } from "@/types";
import { useState } from "react";
import { Card } from "../ui/card";
import CheckoutProduct from "./checkout-product";

type Props = {
  items: CheckoutItem[];
};

const ReviewItems = ({ items }: Props) => {
  const [openReviewSection, setOpenReviewSection] = useState(true);
  return (
    <>
      {!openReviewSection && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">Review items and shipping</h2>
          </div>
        </Card>
      )}
      {openReviewSection && (
        <Card className="flex flex-col w-full m-4">
          <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h2 className="text-xl font-bold">Review items and shipping</h2>
            {items.map((item) => (
              <CheckoutProduct product={item} key={item.variantId} />
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default ReviewItems;
