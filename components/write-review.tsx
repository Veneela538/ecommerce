"use client";

import { getUserReview } from "@/actions/review/get_user_review";
import { updateReview } from "@/actions/review/update_review";
import { Star } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  variantAsin: string;
};

const WriteReview = ({ variantAsin }: Props) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [initialRating, setInitialRating] = useState(0);
  const [initialReview, setInitialReview] = useState("");

  const [isPending, startTransition] = useTransition();

  const isChanged = rating !== initialRating || review !== initialReview;

  // load existing review
  useEffect(() => {
    const loadReview = async () => {
      const res = await getUserReview(variantAsin);

      if (res?.data) {
        setRating(res.data.rating);
        setReview(res.data.reviewMessage);

        setInitialRating(res.data.rating);
        setInitialReview(res.data.reviewMessage);
      }
    };

    loadReview();
  }, [variantAsin]);

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await updateReview(variantAsin, {
        rating,
        reviewMessage: review,
      });

      if (res?.status) {
        setInitialRating(rating);
        setInitialReview(review);
        toast.success("Review submitted successfully");
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            onClick={() => setRating(star)}
            className={`cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Textarea */}
      <textarea
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border rounded-lg p-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={isPending || !isChanged}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full w-fit disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
};

export default WriteReview;
