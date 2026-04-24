"use client";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { IProduct, IReview } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import ReviewCard from "./review-card";

type ProductReviewsType = {
  product: IProduct;
  variantAsin: string;
  initialReviews: IReview[];
};
const ProductReviews = ({
  product,
  variantAsin,
  initialReviews,
}: ProductReviewsType) => {
  const router = useRouter();
  const dict = useDictionary();
  return (
    initialReviews.length > 0 && (
      <>
        <div>
          <h2 className="text-xl font-bold mb-2">{dict.reviews.reviews}</h2>

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
              {dict.reviews.seeMoreReviews}
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
    )
  );
};

export default ProductReviews;
