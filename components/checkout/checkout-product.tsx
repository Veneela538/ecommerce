"use client";

import { addToCartAndSavedForLater } from "@/actions/cart/add_to_cart_and_save_for_later";
import { savedForLater } from "@/actions/cart/save_for_later";
import { updateCart } from "@/actions/cart/update-cart";
import { refreshCheckout } from "@/actions/order/checkout";
import { useCheckout } from "@/context/checkout";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { CheckoutItem } from "@/types";
import { LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
type CheckoutProductsType = {
  product: CheckoutItem;
};

const CheckoutProduct = ({ product }: CheckoutProductsType) => {
  const checkout = useCheckout();
  const router = useRouter();
  const dict = useDictionary();
  const path = usePathname();
  const isSingleOrderCheckout = !path.endsWith("/checkout");
  const [quantity, setQuantity] = useState<number>(
    isSingleOrderCheckout ? checkout.singleOrderQuantity : product.quantity,
  );
  const [isPending, startTransition] = useTransition();
  const [isPendingSecondary, startSecondaryTransition] = useTransition();

  useEffect(() => {
    if (isSingleOrderCheckout) {
      checkout.setSingleOrderQuantity(quantity);
      return;
    }

    if (product.quantity === quantity) return;

    updateCart(product.variantAsin, quantity).catch(() =>
      console.error(dict.crud.error.update),
    );
  }, [quantity, product.quantity, product.variantAsin]);

  const handleDecrease = async () => {
    const newQuantity = quantity - 1;

    setQuantity(newQuantity);
    if (newQuantity === 0) {
      if (isSingleOrderCheckout) {
        checkout.setSingleOrderQuantity(1);
        redirect("/cart");
      }
      startTransition(async () => {
        checkout?.setIsProcessing(true);
        saveForLaterItem();
        checkout?.setIsProcessing(false);
      });
    }
  };

  const saveForLater = async () => {
    startSecondaryTransition(async () => {
      saveForLaterItem();
    });
  };

  const saveForLaterItem = async () => {
    try {
      if (product.id === 0) {
        addToCartAndSavedForLater(product.variantAsin, quantity).then(() =>
          router.push("/cart"),
        );
      } else {
        savedForLater(product.id, true).then(() => refreshCheckout());
      }
    } catch {
      toast.error(dict.crud.error.update);
    }
  };

  return (
    quantity > 0 && (
      <div className="flex flex-col">
        <div className="flex flex-row gap-6  p-4">
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
            <div className="flex flex-row items-center bg-gray-100 rounded-lg shadow-inner w-40 mb-3">
              <Button
                className="bg-gray-500 text-white rounded-none w-1/3"
                onClick={handleDecrease}
                disabled={isPending || isPendingSecondary}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : quantity == 1 ? (
                  <Trash2 />
                ) : (
                  <>-</>
                )}
              </Button>

              <span className="w-1/3 text-center font-semibold text-gray-900">
                {quantity}
              </span>

              <Button
                className="bg-gray-700 text-white rounded-none w-1/3"
                onClick={() => setQuantity((prev) => prev + 1)}
                disabled={isPending || isPendingSecondary}
              >
                +
              </Button>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-start"
              onClick={saveForLater}
              disabled={isPending || isPendingSecondary}
            >
              {isPendingSecondary ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <span>Save For Later</span>
              )}
            </Button>
          </div>
        </div>
        {!product.isAvailable && (
          <div className="w-full bg-gray-300 text-black text-center py-3 rounded-b-xl font-semibold">
            Out Of Stock
          </div>
        )}
      </div>
    )
  );
};

export default CheckoutProduct;
