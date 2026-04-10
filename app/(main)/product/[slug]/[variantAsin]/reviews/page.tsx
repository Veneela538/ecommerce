// app/product/[slug]/[asin]/reviews/page.tsx

import getProduct from "@/actions/products/get_product";
import getRatingCount from "@/actions/review/get_rating_count";
import getReviews from "@/actions/review/get_reviews";
import Reviews from "@/components/product/reviews";
import { IProduct, IRatingCount } from "@/types";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ variantAsin: string }>;
}) {
  const props = await params;

  const res = await getReviews(
    props.variantAsin,
    0,
    5,
    undefined,
    "ALL_REVIEWS",
  );

  const { data: ratingCountRaw = [] } = await getRatingCount(props.variantAsin);

  const { data: product }: { data: IProduct } = await getProduct(
    props.variantAsin,
  );

  // Fill missing ratings (1–5)
  const ratingCount: IRatingCount[] = [1, 2, 3, 4, 5].map((rating) => {
    const found = ratingCountRaw.find((r: IRatingCount) => r.rating === rating);
    return {
      rating,
      count: found ? found.count : 0,
    };
  });

  // Total count
  const totalCount = ratingCount.reduce((sum, r) => sum + r.count, 0);

  return (
    <Reviews
      asin={props.variantAsin}
      initialReviews={res?.data?.content || []}
      ratingCount={ratingCount}
      totalCount={totalCount}
      productName={product.name}
      productDescription={product.description}
      rating={product.averageRating}
      imageUrl={product.imageUrls}
    />
  );
}
