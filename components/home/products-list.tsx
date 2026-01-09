"use server";

import getCategoryProducts from "@/actions/categories/category-products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ICategoryProduct } from "@/types";
import { Item } from "./item";

type DisplayProductsListType = {
  category: string;
};

export const ProductsList = async ({ category }: DisplayProductsListType) => {
  const {
    data: { content },
  } = await getCategoryProducts(category);
  console.log(content);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
        {category} Products
      </h1>
      <Carousel className="w-full max-w-full">
        <CarouselContent>
          {content.map((product: ICategoryProduct) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-1">
                <Item product={product} key={product.id} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
