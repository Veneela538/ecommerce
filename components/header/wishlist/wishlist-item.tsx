"use client";
import { updateCart } from "@/actions/cart/update-cart";
import { deleteFromWishlist } from "@/actions/wishlist/delete-from-wishlist";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { IWishlistProduct } from "@/types";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WishlistProductsType = {
  product: IWishlistProduct;
};

const WishlistItem = ({ product }: WishlistProductsType) => {
  const dict = useDictionary();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const router = useRouter();
  if (isRemoved) {
    return null;
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const remove = () => {
    try {
      setIsRemoved(true);
      deleteFromWishlist(product.variantAsin);
    } catch (error) {
      throw error;
    }
  };
  const addToCart = async () => {
    await updateCart(product.variantAsin, 1);
    setIsAddedToCart(true);
  };
  return (
    <Card className="flex flex-col">
      <div className="relative flex flex-row gap-6 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
        <button
          onClick={remove}
          className="absolute top-3 right-3 text-gray-500 hover:text-black 
             rounded-full p-1 hover:bg-gray-200 transition"
          aria-label="Remove from wishlist"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================================================================= */}
        {/*  ✅ PART 1 — PRODUCT IMAGE                                       */}
        {/* ================================================================= */}
        <div className="relative w-40 h-40 bg-white border rounded-lg flex-shrink-0">
          <Link
            href={`/product/${buildSlug(product.name)}/${product.variantAsin}`}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
            />
          </Link>
        </div>
        {/* ================================================================= */}
        {/*  ✅ PART 2 — TITLE + DESCRIPTION + INSTOCK + ADDED AT             */}
        {/* ================================================================= */}
        <div className="flex flex-col justify-center w-2/3">
          <Link
            href={`/product/${buildSlug(product.name)}/${product.variantAsin}`}
            className="block"
          >
            <h3 className="font-semibold text-xl text-[#232f3e] mb-1">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm line-clamp-3 mb-2">
              {product.description}
            </p>
            <div className="flex flex-row gap-4 text-gray-600 text-sm line-clamp-3 mb-2">
              <p className="font-bold">₹{product.price}</p>
              <p className="line-through">₹{product.discountedPrice}</p>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 mb-2">
              {product.isAvailable ? "In Stock" : "Out Of Stock"}
            </p>
            <p className="text-gray-600 text-sm line-clamp-3 mb-2">
              {dict.wishlist.item.itemAddedAt}
              {formatDate(product.addedAt)}
            </p>
          </Link>
        </div>
        {/* ================================================================= */}
        {/*  ✅ PART 3 — ACTION BUTTONS (REMOVE + BUY)                       */}
        {/* ================================================================= */}
        <div className="flex flex-col justify-center items-end gap-3">
          {isAddedToCart ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2 bg-green-100 w-36 p-2 text-green-700 font-semibold text-sm rounded-md">
                <Check className="w-4 h-4" />
                <span>{dict.wishlist.item.addedToCart}</span>
              </div>
              <Button
                className="w-36 bg-white text-black border border-black hover:bg-gray-200"
                onClick={() => router.push("/cart")}
              >
                {dict.wishlist.item.viewCart}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Button
                className="w-36 bg-white text-black border border-black hover:bg-gray-200"
                onClick={remove}
              >
                {dict.wishlist.item.remove}
              </Button>
              <Button
                className="bg-gray-700 text-white hover:bg-gray-800 w-36"
                onClick={addToCart}
              >
                {dict.wishlist.item.addToCart}
              </Button>
              {/* <Button
                className="bg-gray-700 text-white hover:bg-gray-800 w-36"
                onClick={buyNow}
              >
                Buy Now
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WishlistItem;
