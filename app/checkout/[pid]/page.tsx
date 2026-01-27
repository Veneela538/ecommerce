import { getAddress } from "@/actions/address/get-address";
import getProduct from "@/actions/products/get_product";
import CheckoutLayout from "@/components/checkout/checkout-layout";
import { mapProductToCheckoutItem } from "@/lib/mappers/checkout.mapper";

const CheckoutSingleProduct = async ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  const { pid } = await params;
  const productId = Number(pid);

  const response = await getProduct(productId);
  const { data: addressResponse } = await getAddress();

  const product = response?.data;
  return (
    <CheckoutLayout
      items={[mapProductToCheckoutItem(product)]}
      addressResponse={addressResponse}
      variantId={productId}
    />
  );
};

export default CheckoutSingleProduct;
