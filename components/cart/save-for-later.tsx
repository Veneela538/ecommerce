"use client";
import { useDictionary } from "@/context/dictionary-context";
import { ICartProduct } from "@/types";
import { useEffect, useState } from "react";
import SavedForLaterItem from "./saved-for-later-item";

type SavedForLaterItems = {
  items: ICartProduct[];
};
const SaveForLater = ({ items }: SavedForLaterItems) => {
  const dict = useDictionary();
  const [savedForLaterItems, setSavedForLaterItems] = useState<ICartProduct[]>(
    [],
  );

  useEffect(() => {
    setSavedForLaterItems(items.filter((item) => item.saveForLater === true));
  }, [items]);

  const handleRemove = (variantAsin: string) => {
    setSavedForLaterItems((prev) =>
      prev.filter((item) => item.variantAsin !== variantAsin),
    );
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 w-full lg:w-3/4 mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {dict.cart.saveForLater.title}
        </h2>
        {savedForLaterItems.length === 0 && (
          <p className="text-gray-500 text-sm">
            {dict.cart.saveForLater.noItemsSavedForLater}
          </p>
        )}
        {savedForLaterItems.map((item) => (
          <SavedForLaterItem
            item={item}
            key={item.variantAsin}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default SaveForLater;
