"use server";

import { IProduct } from "@/types";
import { getCategories } from "./categories";
import getCategoryProducts from "./category-products";

export interface AllCategoriesProducts {
  category: string;
  products: IProduct[];
}

const all_categories_products = async (): Promise<AllCategoriesProducts[]> => {
  try {
    const response = await getCategories();
    const categoriesList = Array.isArray(response?.data) ? response?.data : [];
    const all_categories_products = await Promise.all(
      categoriesList.map(async (category: string) => ({
        category,
        products: (await getCategoryProducts(category))?.data?.content || [],
      })),
    );
    return all_categories_products;
  } catch (error) {
    throw error;
  }
};

export default all_categories_products;
