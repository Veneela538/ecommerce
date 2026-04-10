import getAllOrders from "@/actions/order/get-all-orders";
import { getDictionary } from "@/lib/dictionaries";
import { IOrder } from "@/types";
import Link from "next/link";
import DownloadInvoiceButton from "../download-invoice";

type params = {
  page?: number;
};

const Orders = async ({ page = 1 }: params) => {
  const dict = await getDictionary("en");

  const { data } = await getAllOrders(page - 1);

  const orders = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.number + 1 || 1;

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">{dict.orders.title}</h1>
        <p className="text-gray-600">{dict.orders.noOrders}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{dict.orders.title}</h1>

      {orders.map((order: IOrder) => (
        <div key={order.id} className="border rounded-lg bg-white shadow-sm">
          {/* HEADER */}
          <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between gap-4 text-sm">
            <div>
              <p className="text-gray-500">{dict.orders.orderPlaced}</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">{dict.orders.total}</p>
              <p className="font-medium">₹{order.totalAmount}</p>
            </div>

            <div>
              <p className="text-gray-500">{dict.orders.orderNo}</p>
              <p className="font-medium text-blue-600">{order.orderNumber}</p>
            </div>
          </div>

          {/* STATUS */}
          <div className="px-4 py-4">
            <p className="text-lg font-semibold text-green-600">
              {order.status === "DELIVERED" ? "Delivered" : order.status}
            </p>
            {order.deliveredAt && (
              <p className="text-sm text-gray-500">
                {dict.orders.deliveredOn}
                {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4 border-t text-sm">
            <div>
              <p className="font-semibold mb-1">
                {dict.orders.shippingAddress}
              </p>
              <p className="text-gray-600 whitespace-pre-line">
                {order.deliveryAddress}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">{dict.orders.paymentInfo}</p>
              <p className="text-gray-600">
                {dict.orders.method}: {order.paymentMethod}
              </p>
              <p className="text-gray-600">
                {dict.orders.transactionId}: {order.paymentTransactionId}
              </p>
              <p className="text-gray-600">
                {dict.orders.paymentStatus}:{" "}
                <span className="font-medium text-green-600">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div className="px-4 py-4 border-t text-sm space-y-1">
            <div className="flex justify-between">
              <span>{dict.orders.subTotal}</span>
              <span>₹{order.price}</span>
            </div>
            <div className="flex justify-between">
              <span>{dict.orders.tax}</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>{dict.orders.shippingCharge}</span>
              <span>₹{order.shippingCharge}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2">
              <span>{dict.orders.orderTotal}</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-4 py-3 border-t flex flex-wrap gap-4 text-sm justify-between">
            <DownloadInvoiceButton orderNumber={order.orderNumber} />
            <Link
              href={`/orders/${order.orderNumber}`}
              className="text-blue-600 hover:underline"
            >
              View Order
            </Link>
          </div>
        </div>
      ))}

      <div className="flex justify-center gap-2 mt-6">
        {/* Prev */}
        <Link
          href={`?page=${currentPage - 1}`}
          className={`px-3 py-1 border rounded ${
            currentPage === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`?page=${i}`}
            className={`px-3 py-1 border rounded ${
              i === currentPage ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}

        {/* Next */}
        <Link
          href={`?page=${currentPage + 1}`}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Orders;
