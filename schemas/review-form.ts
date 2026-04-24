import { z } from "zod";

export const ReviewFormSchema = z.object({
  reviewTitle: z
    .string()
    .min(1, "Review title cannot be empty")
    .max(300, "Review title cannot exceed 300 characters"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  reviewMessage: z
    .string()
    .min(1, "Review message cannot be empty")
    .max(500, "Review message cannot exceed 500 characters"),

  imageUrls: z.array(z.string().url("Invalid image URL")).optional(),
});
