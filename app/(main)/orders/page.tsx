import Orders from "@/components/header/orders";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  return <Orders page={page} />;
};

export default OrdersPage;
