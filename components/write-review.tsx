"use client";

import { getUserReview } from "@/actions/review/get_user_review";
import { updateReview } from "@/actions/review/update_review";
import { Star } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "./ui/button";

import { ReviewFormSchema } from "@/schemas/review-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  variantAsin: string;
};

const WriteReview = ({ variantAsin }: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ReviewFormSchema>>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      reviewTitle: "",
      rating: 0,
      reviewMessage: "",
      imageUrls: [],
    },
  });

  const { isDirty } = form.formState;

  const rating = form.watch("rating");
  const review = form.watch("reviewMessage");
  const reviewTitle = form.watch("reviewTitle");

  // ✅ Load existing review
  useEffect(() => {
    const loadReview = async () => {
      const res = await getUserReview(variantAsin);

      if (res?.data) {
        form.reset({
          reviewTitle: res.data.reviewTitle || "",
          rating: res.data.rating || 0,
          reviewMessage: res.data.reviewMessage || "",
          imageUrls: res.data.imageUrls || [],
        });
      }
    };

    loadReview();
  }, [variantAsin, form]);

  const onSubmit = (values: z.infer<typeof ReviewFormSchema>) => {
    startTransition(async () => {
      try {
        const res = await updateReview(variantAsin, values);

        if (res?.status) {
          toast.success("Review submitted successfully");
          form.reset(values);
        } else if (res?.errors) {
          const firstError = Object.values(res.errors)[0];
          toast.error(firstError as string);
        } else {
          toast.error(res?.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* ✅ Title as heading (read-only) */}
      <h2 className="text-lg font-semibold">
        {reviewTitle || "No title available"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
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
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Write your review..."
                    className="border rounded-lg p-3 resize-none h-24 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full w-fit disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WriteReview;
