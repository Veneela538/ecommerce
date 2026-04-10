"use client";

import { formatDate } from "@/lib/utils";
import { IReview } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  review: IReview;
};

const ReviewCard = ({ review }: Props) => {
  return (
    <div className="border-b pb-5">
      {/* Name + Rating (Amazon style) */}
      <div className="flex flex-col gap-1">
        {/* Row: Avatar + Name */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={review.name} />
            <AvatarFallback>
              {review.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="font-bold text-md">{review.name}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Rating below */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="font-semibold text-md">{review.reviewTitle}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Reviewed on {formatDate(review.updatedAt)}
      </p>

      <p className="text-sm text-green-600 font-medium mt-1">
        Verified Purchase
      </p>

      {/* Review Message */}
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
        {review.reviewMessage}
      </p>

      {/* Images (max 3 → show directly, no carousel) */}
      {review.imageUrls?.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {review.imageUrls.slice(0, 3).map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`review-${i}`}
              width={100}
              height={100}
              className="rounded border object-contain p-2 h-[100px] w-[100px] cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
