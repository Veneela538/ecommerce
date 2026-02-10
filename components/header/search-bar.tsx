"use client";

import { searchProducts } from "@/actions/products/search_products";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDictionary } from "@/context/dictionary-context";
import { buildSlug } from "@/lib/utils";
import { ICategoryProduct } from "@/types";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const dict = useDictionary();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<ICategoryProduct[]>([]);

  const handleSearch = async () => {
    // 🔍 You can route to a search page or filter products
    await searchProducts(searchQuery).then(
      (res) => res.status == true && setSearchData(res.data.content),
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id="search-bar"
          className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96"
        >
          <Input
            type="text"
            placeholder={dict.header.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black border-0 focus:ring-0 flex-1"
          />

          <Button
            size="sm"
            onClick={handleSearch}
            className="bg-[#232f3e] hover:bg-[#1a2430]"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Search Product.</CommandEmpty>
            <CommandGroup>
              {searchData.map((item) => (
                <CommandItem
                  key={item.variantAsin}
                  value={item.title}
                  onSelect={() => {
                    redirect(
                      `/product/${buildSlug(item.title)}/${item.variantAsin}`,
                    );
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
