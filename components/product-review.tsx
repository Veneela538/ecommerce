"use client";

import { updateReview } from "@/actions/review/update_review";
import { IProduct, IReview } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  review: IReview;
  product: IProduct;
};

const ProductReview = ({ review, product }: Props) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewMessage, setReviewMessage] = useState(
    review?.reviewMessage || "",
  );
  const [imageUrls, setImageUrls] = useState<string[]>(review?.imageUrls || []);
  const [imageInput, setImageInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const [initialRating, setInitialRating] = useState(review?.rating || 0);
  const [initialReviewMessage, setInitialReviewMessage] = useState(
    review?.reviewMessage || "",
  );
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>(
    review?.imageUrls || [],
  );

  const isImageChanged =
    imageUrls.length !== initialImageUrls.length ||
    imageUrls.some((url, i) => url !== initialImageUrls[i]);

  const isChanged =
    rating !== initialRating ||
    reviewMessage !== initialReviewMessage ||
    isImageChanged;

  const addImageUrl = () => {
    const url = imageInput.trim();

    if (!url) return;

    if (imageUrls.includes(url)) {
      toast.error("Image already added");
      return;
    }

    if (imageUrls.length >= 3) {
      toast.error("Maximum 3 images allowed. Remove one to add another.");
      return;
    }

    setImageUrls((prev) => [...prev, url]);
    setImageInput("");
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await updateReview(product.productVariantAsin, {
        rating,
        reviewMessage,
        imageUrls,
      });

      if (res?.status) {
        setInitialRating(rating);
        setInitialReviewMessage(reviewMessage);
        setInitialImageUrls(imageUrls);

        toast.success("Review submitted successfully");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 mt-6">
      {/* Product Image */}
      <div className="flex gap-6 items-start">
        <Image
          src={product.imageUrls[0]}
          alt="product"
          width={120}
          height={120}
          className="rounded-lg border"
        />

        <div>
          <h2 className="text-lg font-semibold">How was the item?</h2>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Overall Rating</p>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              onClick={() => setRating(star)}
              className={`cursor-pointer ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Message */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Add a written review</p>

        <textarea
          placeholder="What did you like or dislike?"
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
          className="border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Add photos (via URL)</p>

        <div className="flex flex-col gap-1">
          {/* Input + Button */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={addImageUrl}
              className="bg-gray-700 text-white hover:bg-gray-800 px-4"
              disabled={!imageInput.trim()}
            >
              Add
            </Button>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-500">
            You can add up to 3 images ({imageUrls.length}/3)
          </p>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              <p className="text-sm text-blue-600 break-all">{url}</p>

              <Button
                onClick={() =>
                  setImageUrls((prev) => prev.filter((_, i) => i !== index))
                }
                variant="link"
                className="p-0 h-auto text-sm text-blue-800 hover:underline font-normal self-start"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        className="bg-gray-700 text-white hover:bg-gray-800 w-36"
        onClick={handleSubmit}
        disabled={!isChanged || isPending}
      >
        Submit Review
      </Button>
    </div>
  );
};

export default ProductReview;
