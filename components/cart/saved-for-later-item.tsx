"use client";
import { savedForLater } from "@/actions/cart/save_for_later";
import { updateCart } from "@/actions/cart/update-cart";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { ICartProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type SavedForLaterProduct = {
  item: ICartProduct;
  onRemove: (variantAsin: string) => void;
};
const SavedForLaterItem = ({ item, onRemove }: SavedForLaterProduct) => {
  const router = useRouter();
  const dict = useDictionary();
  const handleDelete = async () => {
    try {
      await updateCart(item.variantAsin, 0);
      onRemove(item.variantAsin); // 👈 THIS updates UI
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const moveToCart = async () => {
    try {
      await savedForLater(item.id, false);
      router.refresh();
    } catch (error) {
      console.error("Error Saving for Later:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col" key={item.variantAsin}>
        <div className="flex flex-row gap-6  p-4">
          {/* ================================================================= */}
          {/*  ✅ PART 1 — PRODUCT IMAGE                                       */}
          {/* ================================================================= */}
          <div className="relative w-40 h-40 bg-white border rounded-lg flex-shrink-0">
            <Link href={`/product/${buildSlug(item.name)}/${item.variantAsin}`}>
              <Image
                src={item.imageUrls[0]}
                alt={item.name}
                fill
                className="object-contain p-2"
              />
            </Link>
          </div>

          {/* ================================================================= */}
          {/*  ✅ PART 2 — TITLE + DESCRIPTION                                  */}
          {/* ================================================================= */}
          <div className="flex flex-col justify-center w-2/3">
            <Link
              href={`/product/${buildSlug(item.name)}/${item.variantAsin}`}
              className="block"
            >
              <h3 className="font-semibold text-xl text-[#232f3e] mb-1">
                {item.name}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {item.description}
              </p>
              <div className="flex flex-row gap-4 text-gray-600 text-sm line-clamp-3 mb-3">
                <p className="font-bold">₹{item.discountedPrice}</p>
                <p className="line-through">₹{item.price}</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {Math.ceil(
                    ((item.price - item.discountedPrice) / item.price) * 100,
                  )}
                  % OFF
                </Badge>
              </div>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-end gap-3">
            <Button
              className="w-36 bg-white text-black border border-black hover:bg-gray-200"
              onClick={handleDelete}
            >
              {dict.cart.saveForLater.item.delete}
            </Button>

            <Button
              className="bg-gray-700 text-white hover:bg-gray-800 w-36"
              onClick={moveToCart}
            >
              {dict.cart.saveForLater.item.moveToCart}
            </Button>
          </div>
        </div>
        {!item.isAvailable && (
          <div className="w-full bg-gray-300 text-black text-center py-3 rounded-b-xl font-semibold">
            {dict.cart.saveForLater.item.outOfStock}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedForLaterItem;
