import { auth } from "@/auth";
import { buildSlug, formatDate } from "@/lib/utils";
import { IOrder } from "@/types";
import Image from "next/image";
import Link from "next/link";
import DownloadInvoiceButton from "./download-invoice";
import OrderTracking from "./order-tracking";
import WriteReview from "./write-review";

type Props = {
  order: IOrder;
};
const Order = async ({ order }: Props) => {
  const session = await auth();

  const username = session?.user?.name;
  return (
    <>
      {/* <Card className="flex justify-center p-4"> */}
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto p-4 bg-gray-100">
          <div className="flex flex-col gap-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-semibold">Order Details</h1>
                <DownloadInvoiceButton orderNumber={order.orderNumber} />
              </div>
              <p>
                Order placed {formatDate(order.createdAt)} | Order number{" "}
                {order.orderNumber}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="border border-gray-200 rounded-xl shadow-sm grid grid-cols-3 gap-4 p-4 hover:shadow-md transition">
                <div className="flex flex-col">
                  <p className="text-md font-bold pb-1">Ship to</p>
                  <p>{username}</p>
                  <p>{order.deliveryAddress}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-bold pb-1">Payment method</p>
                  <p>{order.paymentMethod}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-bold pb-1">Order Summary</p>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                    <p>Item(s) Subtotal:</p>
                    <p className="text-right">₹{order.price}</p>

                    <p>Shipping:</p>
                    <p className="text-right">₹{order.shippingCharge}</p>

                    <p>Total:</p>
                    <p className="text-right">₹{order.totalAmount}</p>

                    <p className="font-bold">Grand Total:</p>
                    <p className="font-bold text-right">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
              {order.orderItemsList.map((item) => {
                return (
                  <div key={item.variantAsin}>
                    <div className="border border-gray-200 rounded-xl shadow-sm grid grid-cols-[3fr_1fr] gap-4 p-4 hover:shadow-md transition">
                      {/* LEFT PORTION */}
                      <div className="flex flex-col">
                        <p className="text-2xl font-bold">
                          {["CREATED", "PAYMENT_PENDING", "PAID"].includes(
                            order.status,
                          )
                            ? `PLACED ON ${formatDate(order.createdAt)}`
                            : order.status === "SHIPPED"
                              ? `SHIPPED ON ${formatDate(order.shippedAt)}`
                              : `DELIVERED ON ${formatDate(order.deliveredAt)}`}
                        </p>
                        {order.status !== "DELIVERED" && (
                          <OrderTracking status={order.status} />
                        )}
                        {/* IMAGE + DETAILS */}
                        <div className="grid grid-cols-[1fr_3fr] gap-2 p-4">
                          <div className="relative w-36 h-36 border rounded-lg overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className={`object-contain p-2`}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/product/${buildSlug(item.name)}/${item.variantAsin}`}
                              className="text-blue-600 font-medium hover:underline"
                            >
                              <p>{item.name}</p>
                            </Link>
                            <p className="line-clamp-2">{item.description}</p>
                            <p className="font-black">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                      {/* RIGHT PORTION */}
                      <div className="pt-2">
                        {/* <div className="pt-2"> */}
                        <Link
                          href={`/review/${item.variantAsin}`}
                          className="border border-gray-700 rounded-xl font-medium text-blue-600 p-2 mt-2 hover:underline"
                        >
                          Write a product review
                        </Link>
                        {/* </div> */}
                        <div className="mt-6">
                          <WriteReview variantAsin={item.variantAsin} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* </Card> */}
    </>
  );
};

export default Order;
