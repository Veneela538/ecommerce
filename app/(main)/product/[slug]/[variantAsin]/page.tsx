import getProduct from "@/actions/products/get_product";
import { auth } from "@/auth";
import ProductDetails from "@/components/product/product-details";
import { getDictionary } from "@/lib/dictionaries";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ variantAsin: string }>;
}) => {
  const dict = await getDictionary("en");
  const props = await params;
  const response = await getProduct(props.variantAsin);
  const product = response?.data;
  const session = await auth();

  return (
    <>
      {product ? (
        <ProductDetails
          product={product}
          variantAsin={props.variantAsin}
          isLoggedIn={session ? true : false}
        />
      ) : (
        <p>{dict.product.noProduct}</p>
      )}
    </>
  );
};

export default ProductPage;
