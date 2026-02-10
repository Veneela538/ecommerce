import getProduct from "@/actions/products/get_product";
import CheckoutLayout from "@/components/checkout/checkout-layout";
import { mapProductToCheckoutItem } from "@/lib/mappers/checkout.mapper";

const CheckoutSingleProduct = async ({
  params,
}: {
  params: Promise<{ variantAsin: string }>;
}) => {
  const { variantAsin } = await params;

  const response = await getProduct(variantAsin);

  const product = response?.data;
  return (
    <CheckoutLayout
      items={[mapProductToCheckoutItem(product)]}
      variantAsin={variantAsin}
    />
  );
};

export default CheckoutSingleProduct;
