import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type OrderSummaryProps = {
  subtotal: number;
  discount: number;
  tax: number;
  delivery: number;
  totalAmount: number;
};

const OrderSummary = ({
  subtotal,
  discount,
  tax,
  delivery,
  totalAmount,
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full lg:w-3/4 mx-auto">
      <h2 className="text-xl font-bold mb-4">PRICE DETAILS</h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax (GST 5%)</span>
          <span>₹{tax}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{delivery}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-base">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <Badge className="mt-4 bg-green-100 text-green-700">
        You save ₹{subtotal - discount} on this order 🎉
      </Badge>

      <Link href="/checkout" className="block mt-6">
        <Button className="w-full mt-6">Proceed to Checkout</Button>
      </Link>
    </div>
  );
};

export default OrderSummary;
