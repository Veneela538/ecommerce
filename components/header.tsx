"use client";

import { getCategories } from "@/actions/categories";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MyAccount from "./header/myaccount";
import SearchBar from "./header/search-bar";

type HeaderType = {
  isAuthenticated: boolean;
};

export default function Header({ isAuthenticated }: HeaderType) {
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        console.log("Feteched categories ", res);
        setCategoriesList(res?.data ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-6">
          {/* Logo / App Name */}
          <h1 className="text-xl font-bold">My E-Commerce App</h1>

          {/* Navigation */}
          <nav>
            <ul className="flex gap-6">
              <li>
                <SearchBar />
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex items-center gap-1 hover:text-gray-300"
                >
                  <ShoppingCart className="h-7 w-7 mt-2" />
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <MyAccount />
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <nav className="bg-gray-500 p-3 shadow">
        <ul className="container mx-auto flex gap-4">
          {categoriesList.map((cat, index) => (
            <li key={index} className="text-white">
              <Link
                href={`/category/${encodeURIComponent(cat)}`} // navigate to category page
                className="hover:bg-gray-700 p-2 rounded"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
