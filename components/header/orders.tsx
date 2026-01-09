import getAllOrders from "@/actions/order/get-all-orders";
import { IOrder } from "@/types";

const Orders = async () => {
  const { data: orders } = await getAllOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Your Orders</h1>
        <p className="text-gray-600">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Your Orders</h1>

      {orders.map((order: IOrder) => (
        <div key={order.id} className="border rounded-lg bg-white shadow-sm">
          {/* HEADER */}
          <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between gap-4 text-sm">
            <div>
              <p className="text-gray-500">ORDER PLACED</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">TOTAL</p>
              <p className="font-medium">₹{order.totalAmount}</p>
            </div>

            <div>
              <p className="text-gray-500">ORDER #</p>
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
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4 border-t text-sm">
            <div>
              <p className="font-semibold mb-1">Shipping Address</p>
              <p className="text-gray-600 whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">Payment Info</p>
              <p className="text-gray-600">Method: {order.paymentMethod}</p>
              <p className="text-gray-600">
                Transaction ID: {order.paymentTransactionId}
              </p>
              <p className="text-gray-600">
                Payment Status:{" "}
                <span className="font-medium text-green-600">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div className="px-4 py-4 border-t text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingCharge}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2">
              <span>Order Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-4 py-3 border-t flex flex-wrap gap-4 text-sm">
            <button className="text-blue-600 hover:underline">
              Download invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
