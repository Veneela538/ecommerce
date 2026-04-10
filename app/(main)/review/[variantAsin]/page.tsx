import getProduct from "@/actions/products/get_product";
import { getUserReview } from "@/actions/review/get_user_review";
import ProductReview from "@/components/product-review";
import { IReview } from "@/types";

const reviewPage = async ({
  params,
}: {
  params: Promise<{ variantAsin: string }>;
}) => {
  const { variantAsin } = await params;
  const { data: review }: { data: IReview } = await getUserReview(variantAsin);
  const { data: product } = await getProduct(variantAsin);
  return <ProductReview review={review} product={product} />;
};

export default reviewPage;
