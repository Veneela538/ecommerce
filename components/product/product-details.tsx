"use client";
import { updateCart } from "@/actions/cart/update-cart";
import getAllReviewImages from "@/actions/review/get_all_review_images";
import getReviewById from "@/actions/review/get_review_by_id";
import { deleteFromWishlist } from "@/actions/wishlist/delete-from-wishlist";
import { updateWishlist } from "@/actions/wishlist/update-wishlist";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { IProduct, IReview, IReviewImage } from "@/types";
import { ArrowLeft, ArrowRight, Heart, HeartPlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoginPopup from "../login-popup";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ReviewCard from "./review-card";

type ProductType = {
  product: IProduct;
  variantAsin: string;
  isLoggedIn: boolean;
  initialReviews: IReview[];
};

const ProductDetails = ({
  product,
  variantAsin,
  isLoggedIn,
  initialReviews,
}: ProductType) => {
  // const isLoggedIn = status === "authenticated";
  const dict = useDictionary();
  const [quantity, setQuantity] = useState(product.cartQuantity);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted ?? false,
  );
  const [openLoginPopup, setOpenLoginPopup] = useState(false);
  // const [openCheckoutPopup, setOpenCheckoutPopup] = useState(false);
  // const [reviews, setReviews] = useState<IReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [allReviewImages, setAllReviewImages] = useState<IReviewImage[]>([]);
  const [imagePage, setImagePage] = useState(0);
  const [imageTotalPages, setImageTotalPages] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IReviewImage | null>(null);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [loadingSelectedReview, setLoadingSelectedReview] = useState(false);
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!isLoggedIn) return;

  //   // setOpenLoginPopup(false);
  //   setIsWishlisted(product.isWishlisted);
  //   setQuantity(product.cartQuantity);
  // }, [product.cartQuantity, product.isWishlisted, isLoggedIn]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 🚫 skip first run
    }

    async function updateCartItems() {
      try {
        await updateCart(variantAsin, quantity);
      } catch (error) {
        console.error("Cart update failed:", error);
      }
    }

    const timeout = setTimeout(updateCartItems, 300);
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

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoadingImages(true);

        const res = await getAllReviewImages(variantAsin, imagePage, 10);

        const newImages = res?.data?.content || [];

        setAllReviewImages((prev) => {
          const combined = [...prev, ...newImages];

          const unique = combined.filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.imageUrl === item.imageUrl),
          );

          return unique;
        });
        setImageTotalPages(res?.data?.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch review images", err);
      } finally {
        setLoadingImages(false);
      }
    }

    fetchImages();
  }, [variantAsin, imagePage, showAllImages]);

  useEffect(() => {
    setAllReviewImages([]);
    setImagePage(0);
  }, [variantAsin]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          !loadingImages &&
          imagePage + 1 < imageTotalPages
        ) {
          setImagePage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadingImages, imagePage, imageTotalPages]);

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

  async function fetchReviewById(reviewId: number) {
    try {
      setLoadingSelectedReview(true);
      const res = await getReviewById(reviewId); // OR your specific API
      setSelectedReview(res?.data);
    } catch (err) {
      console.error("Failed to fetch review", err);
    } finally {
      setLoadingSelectedReview(false);
    }
  }

  return (
    <>
      {openLoginPopup && <LoginPopup open={true} />}

      <div className="flex flex-col items-center justify-center p-8">
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
              <p>{product.averageRating?.toFixed(1)}⭐</p>
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
        <div className="flex flex-col">
          {allReviewImages.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">
                  Customer photos and videos
                </h2>

                <Button
                  variant="link"
                  onClick={() => setShowAllImages(true)}
                  className="text-blue-600 text-sm p-0 h-auto"
                >
                  See all
                </Button>
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {allReviewImages.map((item, index) => (
                    <CarouselItem key={index} className="basis-1/5 px-1">
                      <Image
                        src={item.imageUrl}
                        alt={`review-img-${index}`}
                        width={150}
                        height={150}
                        className="rounded-md border object-contain p-2 h-[180px] w-full cursor-pointer hover:scale-105 transition"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
              {showAllImages && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
                  <div className="bg-white w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg p-8 relative">
                    {/* Close */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowAllImages(false);
                        setSelectedImage(null);
                        setSelectedReview(null);
                      }}
                      className="absolute top-3 right-3 text-gray-600 hover:text-black"
                    >
                      <X className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2 mb-4">
                      {selectedImage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedReview(null);
                          }}
                          className="text-gray-600 hover:text-black"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}

                      <h2 className="text-lg font-bold">Customer Photos</h2>
                    </div>

                    {/* ✅ CASE 1: GRID */}
                    {!selectedImage && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {allReviewImages.map((item, index) => (
                          <Image
                            key={index}
                            src={item.imageUrl}
                            alt={`all-review-${index}`}
                            width={200}
                            height={200}
                            className="rounded border object-contain p-2 w-full h-[150px] cursor-pointer hover:scale-105 transition"
                            onClick={() => {
                              setSelectedImage(item);
                              fetchReviewById(item.reviewId);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* ✅ CASE 2: SELECTED VIEW */}
                    {selectedImage && (
                      <div className="flex gap-6">
                        {/* LEFT → IMAGE */}
                        <div className="w-1/2 flex justify-center items-center">
                          <Image
                            src={selectedImage.imageUrl}
                            alt="selected"
                            width={400}
                            height={400}
                            className="rounded border object-contain"
                          />
                        </div>

                        {/* RIGHT → REVIEW */}
                        <div className="w-1/2">
                          {/* Loading */}
                          {loadingSelectedReview && (
                            <p className="text-gray-500">Loading review...</p>
                          )}

                          {/* Review Data */}
                          {selectedReview && (
                            <ReviewCard review={selectedReview} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Infinite scroll loader */}
                    <div
                      ref={loadMoreRef}
                      className="h-10 flex justify-center items-center"
                    >
                      {loadingImages && (
                        <p className="text-sm text-gray-500">Loading more...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {initialReviews.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-2">Reviews</h2>

                {initialReviews.map((review: IReview, index: number) => (
                  <ReviewCard key={index} review={review} />
                ))}
                <div className="mt-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={() =>
                      router.push(
                        `/product/${buildSlug(product.name)}/${variantAsin}/reviews`,
                      )
                    }
                  >
                    See more reviews
                  </Button>
                </div>
              </div>

              {/* Pagination (unchanged) */}
              {/* <div className="flex justify-center gap-4 mt-4">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
