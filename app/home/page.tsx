"use client";

import all_categories_products, {
  AllCategoriesProducts,
} from "@/actions/all_categories_products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState<AllCategoriesProducts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await all_categories_products(); // 👈 should return AllCategoriesProducts[]
        console.log("Fetched data:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      {products.map((AllCategoryProducts) => (
        <div key={AllCategoryProducts.category}>
          <h1 className="text-3xl font-bold text-center text-[#232f3e] mb-10">
            {AllCategoryProducts.category} Products
          </h1>
          <div className="relative">
            <div className="flex gap-8 pb-4 overflow-x-auto scroll-smooth">
              {AllCategoryProducts.products.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col h-[420px] border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition w-[325px] flex-shrink-0"
                >
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <CardHeader className="p-0">
                      {/* Image container */}
                      <div className="relative w-full h-64 bg-white">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between p-4">
                      <CardTitle className="text-[#232f3e] font-semibold text-lg">
                        <h3 className="bold pb-2">{product.name}</h3>
                      </CardTitle>
                      <CardDescription className="text-gray-800 font-bold text-lg flex justify-between p-">
                        <p className="strong">₹{product.price}</p>
                        <p>{product.averageRating}⭐</p>
                      </CardDescription>
                    </CardContent>
                  </Link>
                  <CardFooter className="flex justify-end p-2">
                    <Button className="bg-gray-600 text-white hover:bg-gray-700">
                      Add To Cart
                    </Button>
                    {/* <Button className="bg-[#232f3e] text-white hover:bg-[#1a2430]">
                      Buy Now
                    </Button> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
            <br />
            <br />
          </div>
        </div>
      ))}
    </main>
  );
};

export default Home;
