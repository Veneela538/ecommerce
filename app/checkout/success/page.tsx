import getOrderSummaryById from "@/actions/order/get-order-summary-by-id";
import ThankYouPage from "@/components/checkout/thankyou-page";

type Props = {
  searchParams: Promise<{ orderId: string }>;
};
const Success = async ({ searchParams }: Props) => {
  const { orderId } = await searchParams;
  const { data: order } = await getOrderSummaryById(orderId);
  return <ThankYouPage order={order} />;
};

export default Success;
