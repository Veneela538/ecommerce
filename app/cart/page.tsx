import { getCartProducts } from "@/actions/get_cart_products";
import CartItem from "@/components/cart/cart-item";
import { ICartProduct } from "@/types";

const Cart = async () => {
  const { data } = await getCartProducts();

  return (
    <main className="h-[calc(100vh-210px)] bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
        Cart Products
      </h1>
      <div className="flex gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {data.map((product: ICartProduct) => {
          return (
            <div className="p-1" key={product.productId}>
              <CartItem product={product} key={product.productId} />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Cart;
