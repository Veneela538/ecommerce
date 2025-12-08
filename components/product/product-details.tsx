"use client";
import { updateCart } from "@/actions/update-cart";
import { IProduct } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type ProductType = {
  product: IProduct;
  variantId?: number | null;
};

const ProductDetails = ({ product, variantId }: ProductType) => {
  const [quantity, setQuantity] = useState(0);
  const [removeProduct, setRemoveProduct] = useState(false);
  // await addToCart(product.product.id, product.product.productVariants[0].id, quantity);
  useEffect(() => {
    if (quantity == 0 && removeProduct == false) return;
    const updateCartItems = async () => {
      try {
        updateCart(product.productVariants[0].id, quantity);
        setRemoveProduct(false);
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    };
    // Wait 300 seconds (300000 ms), then run once
    const timeout = setTimeout(updateCartItems, 300);
    // Cleanup to avoid old timeouts running after quantity changes again
    return () => clearTimeout(timeout);
  }, [quantity, removeProduct, product]);

  return;
  <div className="flex items-center justify-center h-[calc(100vh-210px)] px-8">
    {/* Container with two columns */}
    <div className="flex w-full max-w-6xl">
      {/* Left side - image */}
      <div className="flex items-center justify-center w-1/2">
        <div className="relative w-3/4 h-[400px] bg-white">
          {product.imageUrls ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No image available
            </div>
          )}
        </div>
      </div>

      {/* Right side - details */}
      <div className="flex flex-col justify-center w-1/2 px-8">
        <h1 className="text-2xl font-bold text-[#232f3e] mb-4">
          {product.name}
        </h1>
        <h2 className="text-2xl font-semibold text-[#232f3e] mb-4">
          {product.brand}
        </h2>
        <p className="text-xl text-[#232f3e] mb-4">{product.description}</p>
        <div className="text-gray-800 font-bold text-lg flex justify-between">
          {/* {
              product.productVariants.find(p => p.id == variantId)
            } */}
          <p className="strong">₹{product.averageRating}</p>
          <p>{product.averageRating}⭐</p>
        </div>
        {product.productVariants[0].stockQuantity <= 5 && (
          <div className="strong bg-slate-300 font-extrabold text-center p-2 my-2 rounded text-red-600 ">
            Limited Stock, Hurry up!
          </div>
        )}
        {!product.productVariants[0].isAvailable && (
          <div className="bg-gray-200 text-black font-extrabold text-center rounded p-2 my-2">
            Out Of Stock
          </div>
        )}
        <div className="flex flex-row justify-between gap-4 pt-2">
          {quantity == 0 ? (
            <Button
              className="bg-gray-600 text-white hover:bg-gray-700"
              onClick={() => setQuantity(1)}
            >
              Add To Cart
            </Button>
          ) : (
            <div className="flex flex-row bg-gray-200">
              <Button
                className="bg-gray-500 text-white w-1/3"
                onClick={() => {
                  if (quantity == 1) setRemoveProduct(true);
                  setQuantity((prev) => prev - 1);
                }}
              >
                -
              </Button>
              <h3 className="strong w-1/3 text-center">{quantity}</h3>
              <Button
                className="bg-gray-700 text-white w-1/3"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </Button>
            </div>
          )}

          <Button
            disabled={!product.productVariants[0].isAvailable}
            className="bg-[#232f3e] text-white hover:bg-[#1a2430]"
          >
            Buy Now
          </Button>
        </div>
        <div className="flex flex-row gap-4 mt-4">
          {product.imageUrls.length > 0 && (
            <div className="flex gap-2">
              {product.imageUrls.map((img, i) => (
                <div key={i} className="relative w-36 h-36">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>;
};

export default ProductDetails;
