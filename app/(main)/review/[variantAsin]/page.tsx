import getProduct from "@/actions/products/get_product";
import { getUserReview } from "@/actions/review/get_user_review";
import ProductReviewForm from "@/components/product-review-form";
import { IReview } from "@/types";

const reviewPage = async ({
  params,
}: {
  params: Promise<{ variantAsin: string }>;
}) => {
  const { variantAsin } = await params;
  const { data: review }: { data: IReview } = await getUserReview(variantAsin);
  const { data: product } = await getProduct(variantAsin);
  return <ProductReviewForm review={review} product={product} />;
};

export default reviewPage;
