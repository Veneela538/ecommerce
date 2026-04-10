"use client";

import getReviews from "@/actions/review/get_reviews";
import ReviewCard from "@/components/product/review-card";
import { Button } from "@/components/ui/button";
import { buildSlug } from "@/lib/utils";
import { IRatingCount, IReview, ReviewFilter } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  asin: string;
  initialReviews: IReview[];
  ratingCount: IRatingCount[];
  totalCount: number;
  productName: string;
  productDescription: string;
  rating: number;
  imageUrl: string[];
};

export default function Reviews({
  asin,
  initialReviews,
  ratingCount,
  totalCount,
  productName,
  productDescription,
  rating,
  imageUrl,
}: Props) {
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined,
  );
  const [mediaFilter, setMediaFilter] = useState<ReviewFilter>("ALL_REVIEWS");
  async function loadMoreReviews(reset = false) {
    try {
      setLoading(true);

      const nextPage = reset ? 0 : page + 1;

      const res = await getReviews(
        asin,
        nextPage,
        5,
        ratingFilter,
        mediaFilter,
      );

      const newReviews = res?.data?.content || [];

      if (reset) {
        // ✅ replace when filter changes
        setReviews(newReviews);
      } else {
        // ✅ append when clicking "show more"
        setReviews((prev) => [...prev, ...newReviews]);
      }

      setPage(nextPage);

      // ✅ check if more pages exist
      if (newReviews.length < 5) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // when filters change → reload from page 0
    loadMoreReviews(true);
  }, [ratingFilter, mediaFilter]);
  return (
    <>
      <div className="flex gap-4">
        {/* LEFT → 1/4 */}
        <div className="w-1/4 p-4">
          <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>

          {/* Overall Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold">{rating.toFixed(1)}</span>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            {totalCount} global ratings
          </p>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const found = ratingCount.find((r) => r.rating === star);
              const percent = found ? (found.count / totalCount) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-10">{star} star</span>

                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="text-sm w-10 text-right">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT → 3/4 */}
        <div className="w-3/4 flex gap-4 p-6">
          {/* Product Image */}
          <div className="relative w-40 h-40 bg-white border rounded-lg flex-shrink-0">
            <Link href={`/product/${buildSlug(productName)}/${asin}`}>
              <Image
                src={imageUrl[0]}
                alt={productName}
                fill
                className="object-contain p-2"
              />
            </Link>
          </div>

          {/* Product Details */}
          <div className="w-2/3">
            <Link
              href={`/product/${buildSlug(productName)}/${asin}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 hover:underline"
            >
              {productDescription}
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              {totalCount} reviews • {rating.toFixed(1)} average rating
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-4 items-center">
          {/* ⭐ Rating Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rating:</label>

            <select
              value={ratingFilter ?? "ALL"}
              onChange={(e) => {
                const value = e.target.value;
                setRatingFilter(value === "ALL" ? undefined : Number(value));
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="ALL">All stars</option>
              <option value="5">5 star only</option>
              <option value="4">4 star only</option>
              <option value="3">3 star only</option>
              <option value="2">2 star only</option>
              <option value="1">1 star only</option>
            </select>
          </div>

          {/* 📷 Media Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Type:</label>

            <select
              value={mediaFilter}
              onChange={(e) =>
                setMediaFilter(
                  e.target.value as "ALL_REVIEWS" | "REVIEWS_WITH_IMAGES",
                )
              }
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="ALL_REVIEWS">All reviews</option>
              <option value="REVIEWS_WITH_IMAGES">Reviews with images</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {/* Loader */}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Loading...</p>
        )}

        <div className="flex mt-6">
          {hasMore ? (
            <Button
              variant="outline"
              onClick={() => loadMoreReviews(false)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Show 5 more reviews"}
            </Button>
          ) : (
            <p className="text-sm text-gray-600">
              To see more, search or filter all reviews
            </p>
          )}
        </div>
      </div>
    </>
  );
}
