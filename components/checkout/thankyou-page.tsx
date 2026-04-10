import { IOrderSummary } from "@/types";
import Link from "next/link";
import DownloadInvoiceButton from "../download-invoice";

type Props = {
  order: IOrderSummary;
};
export default function ThankYouPage({ order }: Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 text-center space-y-4 border">
        <div className="text-5xl">✅</div>

        <h1 className="text-2xl font-bold text-gray-800">Payment Successful</h1>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            Order ID: <span className="font-medium">{order.orderId}</span>
          </p>
          <p>
            Amount Paid: <span className="font-medium">₹{order.price}</span>
          </p>
          <p>
            Paid via: <span className="font-medium">{order.paymentMethod}</span>
          </p>
        </div>

        <DownloadInvoiceButton orderNumber={order.orderId} />

        <div className="flex justify-center gap-4 text-sm pt-2">
          <Link href="/orders" className="text-gray-700 hover:underline">
            View Orders
          </Link>

          <span>|</span>

          <Link href="/home" className="text-gray-700 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
