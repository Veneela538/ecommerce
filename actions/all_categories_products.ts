"use server";

import { categories } from "./categories";
import getCategoryProducts, { Product } from "./category-products";

export interface AllCategoriesProducts {
  category: string;
  products: Product[];
}

const all_categories_products = async (): Promise<AllCategoriesProducts[]> => {
  try {
    const response = await categories();
    const categoriesList = Array.isArray(response?.data) ? response?.data : [];
    console.log(categoriesList);
    const all_categories_products = await Promise.all(
      categoriesList.map(async (category: string) => ({
        category,
        products: (await getCategoryProducts(category))?.data?.content || [],
      }))
    );
    console.log(all_categories_products);
    return all_categories_products;
  } catch (error) {
    throw error;
  }
};

export default all_categories_products;
