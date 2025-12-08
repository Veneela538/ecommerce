import getProduct from "@/actions/get_product";
import ProductDetails from "@/components/product/product-details";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log("** ", id);
  const response = await getProduct(Number(id));
  const product = response?.data;

  if (!product) return <p>No product found</p>;

  return <ProductDetails product={product} />;
};

export default ProductPage;
