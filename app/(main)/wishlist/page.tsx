import { getWishlistProducts } from "@/actions/wishlist/get-wishlist-products";
import WishlistItem from "@/components/header/wishlist/wishlist-item";
import { getDictionary } from "@/lib/dictionaries";
import { IWishlistProduct } from "@/types";

const wishlist = async () => {
  const dict = await getDictionary("en");

  const { data } = await getWishlistProducts();
  return (
    <main className="bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
        {dict.wishlist.title}
      </h1>
      <div className="flex flex-col gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {data.map((product: IWishlistProduct) => {
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
              <WishlistItem product={product} key={product.variantAsin} />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default wishlist;
