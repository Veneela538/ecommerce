import { getCategoryProducts } from "@/actions/category-products";
import { ProductsList } from "@/components/home/products-list";
const CategoryProductList = async ({
  params,
}: {
  params: { category: string };
}) => {
  const { category } = params;
  const response = await getCategoryProducts(category);
  const products = response?.data?.content;
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div>
        <ProductsList category={category} />
        <br />
      </div>
    </main>
  );
};
export default CategoryProductList;
