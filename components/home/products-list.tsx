"use client";

import getCategoryProducts from "@/actions/categories/category-products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDictionary } from "@/context/dictionary-context";
import { ICategoryProduct } from "@/types";
import { useEffect, useState } from "react";
import { Item } from "./item";

export const ProductsList = ({
  category,
  initialProducts,
  totalPages,
}: {
  category: string;
  initialProducts: ICategoryProduct[];
  totalPages: number;
}) => {
  const dict = useDictionary();

  const [products, setProducts] = useState<ICategoryProduct[]>(initialProducts);
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = 4;

  const fetchProducts = async (pageNumber: number) => {
    const { data } = await getCategoryProducts(
      category,
      pageNumber,
      ITEMS_PER_PAGE,
    );

    const newItems = data?.content || [];

    let finalItems = newItems;

    // ✅ last page handling (fill from previous)
    if (newItems.length < ITEMS_PER_PAGE && pageNumber === totalPages - 1) {
      const remaining = ITEMS_PER_PAGE - newItems.length;
      const fallback = products.slice(-remaining);

      finalItems = [...fallback, ...newItems];
    }

    setProducts(finalItems);
  };

  // ✅ reset when category changes
  useEffect(() => {
    setPage(0);
    setProducts(initialProducts);
  }, [category, initialProducts]);

  const handleNext = async () => {
    if (page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchProducts(nextPage);
    }
  };

  const handlePrevious = async () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      await fetchProducts(prevPage);
    }
  };

  const isNextDisabled = page >= totalPages - 1;
  const isPrevDisabled = page === 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
        {category} {dict.category.title}
      </h1>

      <Carousel className="w-full max-w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.variantAsin}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-1">
                <Item product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious onClick={handlePrevious} disabled={isPrevDisabled} />

        <CarouselNext onClick={handleNext} disabled={isNextDisabled} />
      </Carousel>
    </div>
  );
};
