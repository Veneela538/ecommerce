"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetch";

export interface Product {
  id: number;
  name: string;
  description: number;
  brand: string;
  price: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  category: string;
}

export const getCategoryProducts = async (category: string) => {
  const session = await auth();
  try {
    return await fetchWrapper.get({
      url: `/public/category/${category}`,
      accessToken: session?.accessToken,
    });
  } catch (error) {
    throw error;
  }
};

export default getCategoryProducts;
