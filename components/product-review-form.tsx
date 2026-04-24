"use client";

import { updateReview } from "@/actions/review/update_review";
import { useDictionary } from "@/context/dictionary-context";
import { IProduct, IReview } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ReviewFormSchema } from "@/schemas/review-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  review: IReview;
  product: IProduct;
};

const ProductReviewForm = ({ review, product }: Props) => {
  const dict = useDictionary();
  const [isPending, startTransition] = useTransition();

  // ✅ local state for image input
  const [imageInput, setImageInput] = useState("");

  const form = useForm<z.infer<typeof ReviewFormSchema>>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      reviewTitle: review?.reviewTitle || "",
      rating: review?.rating || 0,
      reviewMessage: review?.reviewMessage || "",
      imageUrls: review?.imageUrls || [],
    },
  });

  // ✅ track if form changed
  const { isDirty } = form.formState;

  const imageUrls = form.watch("imageUrls") || [];

  const addImageUrl = () => {
    const url = imageInput.trim();

    if (!url) return;

    if (imageUrls.includes(url)) {
      toast.error("Image already added");
      return;
    }

    if (imageUrls.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    form.setValue("imageUrls", [...imageUrls, url], {
      shouldDirty: true, // ✅ important
    });

    setImageInput("");
  };

  const onSubmit = (values: z.infer<typeof ReviewFormSchema>) => {
    startTransition(async () => {
      try {
        const res = await updateReview(product.productVariantAsin, values);

        if (res?.status) {
          toast.success("Review submitted successfully");

          // ✅ reset form so button disables again
          form.reset(values);
        } else if (res?.errors) {
          const firstError = Object.values(res.errors)[0];
          toast.error(firstError as string);
        } else {
          toast.error(res?.message || dict.common.somethingWentWrong);
        }
      } catch (err) {
        console.error(err);
        toast.error(dict.common.somethingWentWrong);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 mt-6">
      {/* Product */}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="reviewTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title your review</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Add title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => field.onChange(star)}
                        className={`cursor-pointer ${
                          star <= field.value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Review Message */}
          <FormField
            control={form.control}
            name="reviewMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="border rounded-lg p-3 h-28 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <Button type="button" onClick={addImageUrl}>
              {dict.reviews.add}
            </Button>
          </div>

          {/* Image Preview */}
          <div className="flex flex-col gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex justify-between border p-2">
                <p className="text-sm text-blue-600 break-all">{url}</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    form.setValue(
                      "imageUrls",
                      imageUrls.filter((_, i) => i !== index),
                      { shouldDirty: true }, // ✅ important
                    )
                  }
                >
                  {dict.reviews.remove}
                </Button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={!isDirty || isPending}>
            {dict.reviews.submitReview}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductReviewForm;
