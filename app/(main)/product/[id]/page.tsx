import getProduct from "@/actions/products/get_product";
import ProductDetails from "@/components/product/product-details";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const response = await getProduct(Number(id));
  const product = response?.data;

  return (
    <>
      {product ? (
        <ProductDetails product={product} variantId={Number(id)} />
      ) : (
        <p>No product found</p>
      )}
    </>
  );
};

export default ProductPage;
