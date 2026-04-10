import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";

type OrderSummaryProps = {
  subtotal: number;
  discount: number;
  delivery: number;
  totalAmount: number;
};

const OrderSummary = async ({
  subtotal,
  discount,
  delivery,
  totalAmount,
}: OrderSummaryProps) => {
  const dict = await getDictionary("en");
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full lg:w-3/4 mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {dict.cart.orderSummary.priceDetails}
      </h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>{dict.cart.orderSummary.subTotal}</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>{dict.cart.orderSummary.discount}</span>
          <span>-₹{subtotal - discount}</span>
        </div>

        <div className="flex justify-between">
          <span>{dict.cart.orderSummary.deliveryCharges}</span>
          <span>₹{delivery}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-base">
          <span>{dict.cart.orderSummary.totalAmount}</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <Badge className="mt-4 bg-green-100 text-green-700">
        You save ₹{subtotal - discount} on this order 🎉
      </Badge>

      <Link href="/checkout" className="block mt-6">
        <Button className="w-full mt-6">{dict.cart.proceedToCheckout}</Button>
      </Link>
    </div>
  );
};

export default OrderSummary;
