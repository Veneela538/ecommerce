import { getCartProducts } from "@/actions/cart/get_cart_products";
import CheckoutLayout from "@/components/checkout/checkout-layout";
import { mapCartProductToCheckoutItem } from "@/lib/mappers/checkout.mapper";
import { CheckoutItem, ICartProduct } from "@/types";

const CheckoutPage = async () => {
  const { data } = await getCartProducts();

  const items: ICartProduct[] = data?.listOfCartItems ?? [];
  const checkoutItems: CheckoutItem[] = items
    .filter((item) => item.saveForLater === false)
    .map(mapCartProductToCheckoutItem);
  return <CheckoutLayout items={checkoutItems} />;
};

export default CheckoutPage;
