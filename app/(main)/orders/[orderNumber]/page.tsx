import getOrderById from "@/actions/order/get-order-by-id";
import Order from "@/components/order";

const orderPage = async ({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) => {
  const { orderNumber } = await params;
  const { data: order } = await getOrderById(orderNumber);
  return <Order order={order} />;
};

export default orderPage;
