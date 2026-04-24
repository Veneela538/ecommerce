"use client";
import getAllReviewImages from "@/actions/review/get_all_review_images";
import getReviewById from "@/actions/review/get_review_by_id";
import { useDictionary } from "@/context/dictionary-context";
import { IReview, IReviewImage } from "@/types";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ReviewCard from "./review-card";

type ReviewImagesGalleryType = {
  variantAsin: string;
};

const ReviewImagesGallery = ({ variantAsin }: ReviewImagesGalleryType) => {
  const dict = useDictionary();
  const [showAllImages, setShowAllImages] = useState(false);
  const [imageState, setImageState] = useState({
    page: 0,
    totalPages: 0,
    loading: false,
    images: [] as IReviewImage[],
  });

  const [selectedState, setSelectedState] = useState<{
    image: IReviewImage | null;
    review: IReview | null;
    loading: boolean;
  }>({
    image: null,
    review: null,
    loading: false,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setImageState((prev) => ({ ...prev, loading: true }));
        const res = await getAllReviewImages(variantAsin, imageState.page, 10);

        const newImages = res?.data?.content || [];

        setImageState((prev) => {
          const combined = [...prev.images, ...newImages];

          const unique = combined.filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.imageUrl === item.imageUrl),
          );

          return {
            ...prev,
            images: unique,
            totalPages: res?.data?.totalPages || 0,
          };
        });
      } catch (err) {
        console.error(dict.crud.error.fetchImages);
      } finally {
        setImageState((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchImages();
  }, [variantAsin, imageState.page, showAllImages]);

  useEffect(() => {
    setImageState((prev) => ({
      ...prev,
      images: [],
    }));
    setImageState((prev) => ({ ...prev, page: 0 }));
  }, [variantAsin]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          !imageState.loading &&
          imageState.page + 1 < imageState.totalPages
        ) {
          setImageState((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
        }
      },
      { threshold: 1 },
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [imageState.loading, imageState.page, imageState.totalPages]);

  async function fetchReviewById(reviewId: number) {
    try {
      setSelectedState((prev) => ({ ...prev, loading: true }));
      const res = await getReviewById(reviewId); // OR your specific API
      setSelectedState((prev) => ({ ...prev, review: res?.data }));
    } catch (err) {
      console.error("Failed to fetch review", err);
    } finally {
      setSelectedState((prev) => ({ ...prev, loading: false }));
    }
  }
  return (
    imageState.images.length > 0 && (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">
            {dict.reviews.customerPhotosAndVideos}
          </h2>

          <Button
            variant="link"
            onClick={() => setShowAllImages(true)}
            className="text-blue-600 text-sm p-0 h-auto"
          >
            {dict.reviews.seeAll}
          </Button>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {imageState.images.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5 px-1">
                <Image
                  src={item.imageUrl}
                  alt={`review-img-${index}`}
                  width={150}
                  height={150}
                  className="rounded-md border object-contain p-2 h-[180px] w-full cursor-pointer hover:scale-105 transition"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
        {showAllImages && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-white w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg p-8 relative">
              {/* Close */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAllImages(false);
                  setSelectedState((prev) => ({
                    ...prev,
                    image: null,
                    review: null,
                  }));
                }}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 mb-4">
                {selectedState.image && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedState((prev) => ({
                        ...prev,
                        image: null,
                        review: null,
                      }));
                    }}
                    className="text-gray-600 hover:text-black"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}

                <h2 className="text-lg font-bold">Customer Photos</h2>
              </div>

              {/* ✅ CASE 1: GRID */}
              {!selectedState.image && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imageState.images.map((item, index) => (
                    <Image
                      key={index}
                      src={item.imageUrl}
                      alt={`all-review-${index}`}
                      width={200}
                      height={200}
                      className="rounded border object-contain p-2 w-full h-[150px] cursor-pointer hover:scale-105 transition"
                      onClick={() => {
                        setSelectedState((prev) => ({
                          ...prev,
                          image: item,
                        }));
                        fetchReviewById(item.reviewId);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ✅ CASE 2: SELECTED VIEW */}
              {selectedState.image && (
                <div className="flex gap-6">
                  {/* LEFT → IMAGE */}
                  <div className="w-1/2 flex justify-center items-center">
                    <Image
                      src={selectedState.image.imageUrl}
                      alt="selected"
                      width={400}
                      height={400}
                      className="rounded border object-contain"
                    />
                  </div>

                  {/* RIGHT → REVIEW */}
                  <div className="w-1/2">
                    {/* Loading */}
                    {selectedState.loading && (
                      <p className="text-gray-500">Loading review...</p>
                    )}

                    {/* Review Data */}
                    {selectedState.review && (
                      <ReviewCard review={selectedState.review} />
                    )}
                  </div>
                </div>
              )}

              {/* Infinite scroll loader */}
              <div
                ref={loadMoreRef}
                className="h-10 flex justify-center items-center"
              >
                {imageState.loading && (
                  <p className="text-sm text-gray-500">Loading more...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ReviewImagesGallery;
