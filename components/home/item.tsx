"use client";

import { buildSlug } from "@/lib/utils";
import { ICategoryProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type DisplayProductsType = {
  product: ICategoryProduct;
};

export const Item = ({ product }: DisplayProductsType) => {
  return (
    <Card
      key={product.variantAsin}
      className="flex flex-col h-[420px] border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition w-[325px] flex-shrink-0"
    >
      <Link
        key={product.variantAsin}
        href={`/product/${buildSlug(product.title)}/${product.variantAsin}`}
      >
        <CardHeader className="p-0">
          {/* Image container */}
          <div className="relative w-full h-64 bg-white">
            <Image
              src={product.imageUrl}
              alt={product.title ?? `Not Found`}
              fill
              className="object-contain p-2"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between p-4">
          <CardTitle className="text-[#232f3e] font-semibold text-lg">
            <h3 className="bold pb-2">{product.title}</h3>
          </CardTitle>
          <CardDescription className="text-gray-800 font-bold text-lg flex justify-between">
            <p className="strong">₹{product.price}</p>
            <p>{product.rating?.toFixed(1)}⭐</p>
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};
