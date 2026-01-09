import { getAddress } from "@/actions/address/get-address";
import getProduct from "@/actions/products/get_product";
import CheckoutLayout from "@/components/checkout/checkout-layout";
import { mapProductToCheckoutItem } from "@/lib/mappers/checkout.mapper";

const CheckoutSingleProduct = async ({
  params,
}: {
  params: { pid: string };
}) => {
  const response = await getProduct(Number(params.pid));
  const { data: addressResponse } = await getAddress();

  const product = response?.data;
  return (
    <CheckoutLayout
      items={[mapProductToCheckoutItem(product)]}
      addressResponse={addressResponse}
    />
  );
};

export default CheckoutSingleProduct;
