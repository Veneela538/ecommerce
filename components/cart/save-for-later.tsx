"use client";
import { ICartProduct } from "@/types";
import { useEffect, useState } from "react";
import SavedForLaterItem from "./saved-for-later-item";

type SavedForLaterItems = {
  items: ICartProduct[];
};
const SaveForLater = ({ items }: SavedForLaterItems) => {
  const [savedForLaterItems, setSavedForLaterItems] = useState<ICartProduct[]>(
    []
  );

  useEffect(() => {
    setSavedForLaterItems(items.filter((item) => item.saveForLater === true));
  }, [items]);

  const handleRemove = (variantId: number) => {
    setSavedForLaterItems((prev) =>
      prev.filter((item) => item.variantId !== variantId)
    );
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 w-full lg:w-3/4 mx-auto">
        <h2 className="text-xl font-bold mb-4">Saved for later</h2>
        {savedForLaterItems.length === 0 && (
          <p className="text-gray-500 text-sm">No items saved for later</p>
        )}
        {savedForLaterItems.map((item) => (
          <SavedForLaterItem
            item={item}
            key={item.variantId}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default SaveForLater;
