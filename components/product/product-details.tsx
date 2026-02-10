"use client";
import { updateCart } from "@/actions/cart/update-cart";
import { deleteFromWishlist } from "@/actions/wishlist/delete-from-wishlist";
import { updateWishlist } from "@/actions/wishlist/update-wishlist";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { IProduct } from "@/types";
import { ArrowRight, Heart, HeartPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginPopup from "../login-popup";
import { Button } from "../ui/button";

type ProductType = {
  product: IProduct;
  variantAsin: string;
  isLoggedIn: boolean;
};

const ProductDetails = ({ product, variantAsin, isLoggedIn }: ProductType) => {
  // const isLoggedIn = status === "authenticated";
  const dict = useDictionary();
  const [quantity, setQuantity] = useState(product.cartQuantity);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted ?? false,
  );
  const [openLoginPopup, setOpenLoginPopup] = useState(false);
  // const [openCheckoutPopup, setOpenCheckoutPopup] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (!isLoggedIn) return;

  //   // setOpenLoginPopup(false);
  //   setIsWishlisted(product.isWishlisted);
  //   setQuantity(product.cartQuantity);
  // }, [product.cartQuantity, product.isWishlisted, isLoggedIn]);

  useEffect(() => {
    async function updateCartItems() {
      try {
        await updateCart(variantAsin, quantity);
      } catch (error) {
        console.error(dict.crud.error.update);
      }
    }

    const timeout = setTimeout(() => {
      updateCartItems();
    }, 300);

    return () => clearTimeout(timeout);
  }, [quantity, variantAsin]);

  useEffect(() => {
    async function updateWishlistItems() {
      try {
        if (product.isWishlisted != isWishlisted) {
          if (isWishlisted) await updateWishlist(variantAsin);
          else await deleteFromWishlist(variantAsin);
        }
      } catch (error) {
        console.error("Error updating wishlist", error);
      }
    }

    const timeout = setTimeout(() => {
      updateWishlistItems();
    }, 300);

    return () => clearTimeout(timeout);
  }, [isWishlisted, product.isWishlisted, variantAsin]);

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === product.imageUrls.length - 1 ? 0 : prev + 1,
    );
  };
  // await addToCart(product.product.id, product.product.productVariants[0].id, quantity);

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  const openLogin = () => {
    const currentPath = window.location.pathname;

    // add callbackUrl to current URL (without page reload)
    router.push(`?callbackUrl=${encodeURIComponent(currentPath)}`);

    setOpenLoginPopup(true);
  };

  const buyNow = async () => {
    await updateCart(variantAsin, quantity == 0 ? 1 : quantity)
      .then(() => {
        router.push(
          `/checkout/${buildSlug(product.name)}/${product.productVariantAsin}`,
        );
      })
      .catch(() => console.error(dict.crud.error.update));
  };

  return (
    <>
      {openLoginPopup && <LoginPopup open={true} />}

      <div className="flex items-center justify-center p-8">
        {/* Container with two columns */}
        <div className="flex w-full max-w-6xl">
          {/* Left side - image */}
          <div className="flex items-center justify-center w-1/2">
            <div className="relative w-3/4 h-[400px] bg-white">
              {product.imageUrls ? (
                <Image
                  src={product.imageUrls[currentIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {dict.product.noImageAvailable}
                </div>
              )}
            </div>
            {product.imageUrls.length > 1 && (
              <ArrowRight
                className="h-6 w-6 cursor-pointer text-gray-700 hover:text-black"
                onClick={goNext}
              />
            )}
          </div>

          {/* Right side - details */}
          <div className="flex flex-col justify-center w-1/2 px-8">
            <div className="flex justify-between w-full">
              <h1 className="text-2xl font-bold text-[#232f3e] mb-4">
                {product.name}
              </h1>
              {isWishlisted ? (
                <Heart
                  className="fill-red-700 stroke-red-700"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openLogin();
                      return;
                    }
                    toggleWishlist();
                  }}
                />
              ) : (
                <HeartPlus
                  onClick={() => {
                    if (!isLoggedIn) {
                      openLogin();
                      return;
                    }
                    toggleWishlist();
                  }}
                />
              )}
            </div>
            <h2 className="text-2xl font-semibold text-[#232f3e] mb-4">
              {product.brand}
            </h2>
            <p className="text-xl text-[#232f3e] mb-4">{product.description}</p>
            <div className="text-gray-800 font-bold text-lg flex justify-between">
              {/* {
              product.productVariants.find(p => p.id == variantId)
            } */}
              <p className="strong">₹{product.price}</p>
              <p>{product.averageRating}⭐</p>
            </div>
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <div className="strong bg-slate-300 font-extrabold text-center p-2 my-2 rounded text-red-600 ">
                {dict.product.limitedStock} Only {product.stockQuantity} left.
              </div>
            )}
            {product.stockQuantity == 0 && (
              <div className="bg-gray-200 text-black font-extrabold text-center rounded p-2 my-2">
                {dict.product.outOfStock}
              </div>
            )}
            <div className="flex flex-row justify-between gap-4 pt-2">
              {quantity == 0 ? (
                <Button
                  className="bg-gray-600 text-white hover:bg-gray-700"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openLogin();
                      return;
                    }
                    setQuantity(1);
                  }}
                >
                  {dict.product.addToCart}
                </Button>
              ) : (
                <div className="flex flex-row bg-gray-200">
                  <Button
                    className="bg-gray-500 text-white w-1/3"
                    onClick={() => {
                      if (!isLoggedIn) {
                        openLogin();
                        return;
                      }
                      if (quantity > 0) {
                        setQuantity((prev) => prev - 1);
                      }
                    }}
                  >
                    -
                  </Button>
                  <h3 className="strong w-1/3 text-center">{quantity}</h3>
                  <Button
                    className="bg-gray-700 text-white w-1/3"
                    onClick={() => {
                      if (!isLoggedIn) {
                        openLogin();
                        return;
                      }
                      setQuantity((prev) => prev + 1);
                    }}
                  >
                    +
                  </Button>
                </div>
              )}

              <Button
                disabled={product.stockQuantity == 0}
                className="bg-[#232f3e] text-white hover:bg-[#1a2430]"
                // onClick={buyNow}
                onClick={() => {
                  if (!isLoggedIn) {
                    openLogin();
                    return;
                  }
                  buyNow();
                }}
              >
                {dict.product.buyNow}
              </Button>
              {/* <CheckoutPopup
                open={openCheckoutPopup}
                onClose={() => setOpenCheckoutPopup(false)}
                isSingleOrderCheckout={true}
                variantId={product.id}
              /> */}
            </div>
            <div className="flex flex-row gap-4 mt-4">
              {product.productVariants.length > 0 && (
                <div className="flex gap-2">
                  {product.productVariants.map((variant, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        router.push(
                          `/product/${buildSlug(product.name)}/${variant.variantAsin}`,
                        )
                      }
                      className="cursor-pointer"
                    >
                      {/* IMAGE BOX */}
                      <div className="relative w-36 h-36 border rounded-lg overflow-hidden">
                        <Image
                          src={variant.imageUrl}
                          alt={product.name}
                          fill
                          className={`object-contain p-2 transition 
                ${!variant.isAvailable ? "opacity-40 grayscale" : ""}
              `}
                        />
                      </div>

                      {/* PRICE BELOW IMAGE */}
                      <p className="text-center font-semibold text-sm mt-2">
                        ₹{variant.price}
                      </p>

                      {/* OUT OF STOCK LABEL */}
                      {!variant.isAvailable && (
                        <p className="text-center text-xs text-red-600 font-bold">
                          {dict.product.outOfStock}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
