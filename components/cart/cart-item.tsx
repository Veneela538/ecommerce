"use client";
import { updateCart } from "@/actions/update-cart";
import { ICartProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type CartProductsType = {
  product: ICartProduct;
};

const CartItem = ({ product }: CartProductsType) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const buyNow = (productId: number) => {
    console.log("order placed");
  };
  useEffect(() => {
    if (product.quantity == quantity) return;
    const updateCartItems = async () => {
      try {
        updateCart(product.variantId, quantity);
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    };

    updateCartItems();
    // const timeout = setTimeout(updateCartItems, 300);

    // Cleanup to avoid old timeouts running after quantity changes again
    // return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <Card
        key={product.variantId}
        className="flex flex-col h-[420px] border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition w-[325px] flex-shrink-0"
      >
        <Link key={product.productId} href={`/product/${product.productId}`}>
          <CardHeader className="pb-2">
            <h1 className="pb-2 justify-center items-center">{product.name}</h1>
            {/* Image container */}
            {/* <div className="relative w-full h-64 bg-white">
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div> */}
          </CardHeader>

          <CardContent className="flex-1 flex flex-row justify-between p-4">
            <CardTitle className="flex-1 flex flex-col text-[#232f3e] font-semibold text-lg">
              {/* <h3 className="bold pb-2">{product.name}</h3> */}
              <div className="relative w-full h-64 bg-white">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <p className="strong">{product.description}</p>
              {/* <p className="strong">₹{product.price}</p> */}
            </CardTitle>
            <CardDescription className="flex-1 flex flex-col text-gray-800 font-bold text-lg justify-center items-center">
              <div className="flex flex-row bg-gray-200 m-2">
                <Button
                  className="bg-gray-500 text-white w-1/3"
                  onClick={() => setQuantity((prev) => prev - 1)}
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

              <Button
                className="bg-gray-600 text-white hover:bg-gray-700 m-2"
                onClick={() => buyNow(product.variantId)}
              >
                Remove
              </Button>

              <Button
                className="bg-gray-600 text-white hover:bg-gray-700 m-2"
                onClick={() => buyNow(product.variantId)}
              >
                Proceed to Buy
              </Button>
              {/* <p className="strong">{product.description}</p>
                    <p className="strong">₹{product.price}</p> */}
              {/* <p>{product.averageRating}⭐</p> */}
            </CardDescription>
          </CardContent>
        </Link>
        <CardFooter className="flex justify-end p-2">
          {/* <Button
            className="bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => buyNow(product.id)}
          >
            Buy Now
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CartItem;
