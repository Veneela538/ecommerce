"use client";

import { categories } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await categories();
        console.log("Feteched categories ", res);
        setCategoriesList(res?.data ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    // 🔍 You can route to a search page or filter products
    console.log("Searching for:", searchTerm);
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-6">
          {/* Logo / App Name */}
          <h1 className="text-xl font-bold">My E-Commerce App</h1>

          {/* Navigation */}
          <nav>
            <ul className="flex gap-6">
              <li>
                {/* Search bar */}
                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 text-black border-0 focus:ring-0"
                  />
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="bg-[#232f3e] hover:bg-[#1a2430]"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </li>
              <li>
                <Link href="/cart" className="flex items-center gap-1">
                  <ShoppingCart className="h-7 w-7 mt-2" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center gap-1">
                  <UserCircle className="h-7 w-7 mt-2" />
                </Link>
              </li>
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
    </>
  );
}
