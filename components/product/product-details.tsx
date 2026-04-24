"use client";
import { IProduct, IReview } from "@/types";
import { useState } from "react";
import LoginPopup from "../login-popup";
import ProductInfo from "./product-info";
import ProductReviews from "./product-reviews";
import ReviewImagesGallery from "./review-images-gallery";

type ProductType = {
  product: IProduct;
  variantAsin: string;
  isLoggedIn: boolean;
  initialReviews: IReview[];
};

const ProductDetails = ({
  product,
  variantAsin,
  isLoggedIn,
  initialReviews,
}: ProductType) => {
  const [openLoginPopup, setOpenLoginPopup] = useState(false);

  return (
    <>
      {openLoginPopup && <LoginPopup open={true} />}

      <div className="flex flex-col items-center justify-center p-8">
        <ProductInfo
          product={product}
          isLoggedIn={isLoggedIn}
          variantAsin={variantAsin}
          openLogin={() => setOpenLoginPopup(true)}
        />
        <div className="flex flex-col">
          <ReviewImagesGallery variantAsin={variantAsin} />
          <ProductReviews
            initialReviews={initialReviews}
            variantAsin={variantAsin}
            product={product}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
