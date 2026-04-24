"use client";

import getReviews from "@/actions/review/get_reviews";
import ReviewCard from "@/components/product/review-card";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { IRatingCount, IReview, ReviewFilter } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const dict = useDictionary();
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);

  const [meta, setMeta] = useState({
    page: 0,
    loading: false,
    hasMore: true,
  });

  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined,
  );
  const [mediaFilter, setMediaFilter] = useState<ReviewFilter>("ALL_REVIEWS");

  // ✅ single source of truth function
  async function fetchReviews({
    page,
    rating,
    media,
    reset = false,
  }: {
    page: number;
    rating?: number;
    media: ReviewFilter;
    reset?: boolean;
  }) {
    try {
      setMeta((prev) => ({ ...prev, loading: true }));

      const res = await getReviews(asin, page, 5, rating, media);

      const data = res?.data;
      const newReviews = data?.content || [];

      const totalElements = data?.totalElements || 0;
      const pageSize = data?.size || 5;
      const pageNumber = data?.number ?? page;

      const hasMore = totalElements > (pageNumber + 1) * pageSize;

      setReviews((prev) => (reset ? newReviews : [...prev, ...newReviews]));

      setMeta({
        page: pageNumber,
        loading: false,
        hasMore,
      });
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setMeta((prev) => ({ ...prev, loading: false }));
    }
  }

  // ✅ filter change handlers (NO useEffect)
  const handleRatingChange = (value: string) => {
    const newRating = value === "ALL" ? undefined : Number(value);

    setRatingFilter(newRating);

    fetchReviews({
      page: 0,
      rating: newRating,
      media: mediaFilter,
      reset: true,
    });
  };

  const handleMediaChange = (value: ReviewFilter) => {
    setMediaFilter(value);

    fetchReviews({
      page: 0,
      rating: ratingFilter,
      media: value,
      reset: true,
    });
  };

  const handleLoadMore = () => {
    fetchReviews({
      page: meta.page + 1,
      rating: ratingFilter,
      media: mediaFilter,
    });
  };

  return (
    <>
      <div className="flex gap-4">
        {/* LEFT */}
        <div className="w-1/4 p-4">
          <h1 className="text-2xl font-bold mb-4">
            {dict.reviews.customerReviews}
          </h1>

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
            {totalCount} {dict.reviews.globalRatings}
          </p>

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

        {/* RIGHT */}
        <div className="w-3/4 flex gap-4 p-6">
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

          <div className="w-2/3">
            <Link
              href={`/product/${buildSlug(productName)}/${asin}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 hover:underline"
            >
              {productDescription}
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              {totalCount} {dict.reviews.reviews} • {rating.toFixed(1)}{" "}
              {dict.reviews.averageRating}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {dict.reviews.rating}:
            </label>

            <select
              value={ratingFilter ?? "ALL"}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="ALL">{dict.reviews.all}</option>

              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {dict.reviews.starOnly.replace("{{count}}", String(star))}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">{dict.reviews.type}:</label>

            <select
              value={mediaFilter}
              onChange={(e) =>
                handleMediaChange(
                  e.target.value as "ALL_REVIEWS" | "REVIEWS_WITH_IMAGES",
                )
              }
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="ALL_REVIEWS">{dict.reviews.allReviews}</option>
              <option value="REVIEWS_WITH_IMAGES">
                {dict.reviews.reviewsWithImages}
              </option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        <div className="flex mt-6">
          {meta.hasMore ? (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={meta.loading}
            >
              {meta.loading
                ? dict.reviews.loading
                : dict.reviews.show5MoreReviews}
            </Button>
          ) : (
            <p className="text-sm text-gray-600">{dict.reviews.seeMore}</p>
          )}
        </div>
      </div>
    </>
  );
}
