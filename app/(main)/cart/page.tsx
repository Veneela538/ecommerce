import { getCartProducts } from "@/actions/cart/get_cart_products";
import CartItem from "@/components/cart/cart-item";
import OrderSummary from "@/components/cart/order-summary";
import SaveForLater from "@/components/cart/save-for-later";
import { getDictionary } from "@/lib/dictionaries";
import { ICartProduct } from "@/types";

const Cart = async () => {
  const dict = await getDictionary("en");
  const { data } = await getCartProducts();
  const CartItems = data.listOfCartItems.filter(
    (item: ICartProduct) => item.saveForLater === false,
  );

  return (
    <main className="bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
        {dict.cart.title}
      </h1>
      <div className="flex flex-col gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CartItems.map((product: ICartProduct) => {
          return (
            <div
              className="
          p-1 
          w-full 
          lg:w-3/4        /* 3/4 width on large screens */
          mx-auto         /* center horizontally */
        "
              key={product.variantAsin}
            >
              <CartItem product={product} key={product.variantAsin} />
            </div>
          );
        })}

        {/* Order Summary */}
        {CartItems.length > 0 && (
          <OrderSummary
            subtotal={data.withoutDiscountPrice}
            discount={data.discountedPrice}
            delivery={data.shippingCharge}
            totalAmount={data.totalAmount}
          />
        )}

        <SaveForLater items={data.listOfCartItems} />
      </div>
    </main>
  );
};

export default Cart;
