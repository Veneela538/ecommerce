"use client";

import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import MyAccount from "./header/myaccount";
import SearchBar from "./header/search-bar";

type HeaderType = {
  isAuthenticated: boolean;
  categories: string[];
};

export default function Header({ isAuthenticated, categories }: HeaderType) {
  const dict = useDictionary();
  return (
    <main>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-6">
          {/* Logo / App Name */}
          <Link href={"/home"}>
            <h1 className="text-xl font-bold">{dict.header.title}</h1>
          </Link>
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
          {categories.map((cat) => (
            <li key={cat} className="text-white">
              <Link
                href={`/category/${buildSlug(cat)}`} // navigate to category page
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
