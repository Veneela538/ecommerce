"use client";
import { savedForLater } from "@/actions/cart/save_for_later";
import { updateCart } from "@/actions/cart/update-cart";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { ICartProduct } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
type CartProductsType = {
  product: ICartProduct;
};

const CartItem = ({ product }: CartProductsType) => {
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const router = useRouter();
  const dict = useDictionary();

  const buyNow = () => {
    router.push(`/checkout/${buildSlug(product.name)}/${product.variantAsin}`);
  };
  const remove = () => setQuantity(0);

  const saveForLater = async () => {
    try {
      await savedForLater(product.id, true);
      router.refresh();
    } catch (error) {
      console.error(dict.crud.error.update);
    }
  };
  useEffect(() => {
    if (product.quantity === quantity) return;

    updateCart(product.variantAsin, quantity).catch(() =>
      console.error(dict.crud.error.update),
    );
  }, [quantity, product.quantity, product.variantAsin]);

  return (
    quantity > 0 && (
      <Card className="flex flex-col">
        <div className="flex flex-row gap-6 border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
          {/* ================================================================= */}
          {/*  ✅ PART 1 — PRODUCT IMAGE                                       */}
          {/* ================================================================= */}
          <div className="relative w-40 h-40 bg-white border rounded-lg flex-shrink-0">
            <Link
              href={`/product/${buildSlug(product.name)}/${product.variantAsin}`}
            >
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </Link>
          </div>

          {/* ================================================================= */}
          {/*  ✅ PART 2 — TITLE + DESCRIPTION + QUANTITY                      */}
          {/* ================================================================= */}
          <div className="flex flex-col justify-center w-2/3">
            <Link
              href={`/product/${buildSlug(product.name)}/${product.variantAsin}`}
              className="block"
            >
              <h3 className="font-semibold text-xl text-[#232f3e] mb-1">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {product.description}
              </p>
              <div className="flex flex-row gap-4 text-gray-600 text-sm line-clamp-3 mb-3">
                <p className="font-bold">₹{product.discountedPrice}</p>
                <p className="line-through">₹{product.price}</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {Math.ceil(
                    ((product.price - product.discountedPrice) /
                      product.price) *
                      100,
                  )}
                  % OFF
                </Badge>
              </div>
            </Link>

            {/* Quantity Selector */}
            <div className="flex flex-row items-center bg-gray-100 rounded-lg shadow-inner w-40">
              <Button
                className="bg-gray-500 text-white rounded-none w-1/3"
                onClick={() => quantity > 0 && setQuantity((prev) => prev - 1)}
              >
                {quantity == 1 ? <Trash2 /> : <>-</>}
              </Button>

              <span className="w-1/3 text-center font-semibold text-gray-900">
                {quantity}
              </span>

              <Button
                className="bg-gray-700 text-white rounded-none w-1/3"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* ================================================================= */}
          {/*  ✅ PART 3 — ACTION BUTTONS (REMOVE + BUY)                       */}
          {/* ================================================================= */}
          <div className="flex flex-col justify-center items-end gap-3">
            <Button
              className="w-36 bg-white text-black border border-black hover:bg-gray-200"
              onClick={remove}
            >
              {dict.cart.product.remove}
            </Button>

            <Button
              className="bg-gray-700 text-white hover:bg-gray-800 w-36"
              onClick={buyNow}
            >
              {dict.cart.product.proceedToBuy}
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-start"
              onClick={saveForLater}
            >
              {dict.cart.product.saveForLater}
            </Button>
          </div>
        </div>
        {!product.isAvailable && (
          <div className="w-full bg-gray-300 text-black text-center py-3 rounded-b-xl font-semibold">
            {dict.product.outOfStock}
          </div>
        )}
      </Card>
    )
  );
};

export default CartItem;
