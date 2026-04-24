import getCategoryProducts from "@/actions/categories/category-products";
import { ProductsList } from "@/components/home/products-list";
import { unslugify } from "@/lib/utils";

export default async function CategoryProductList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const category = unslugify((await params).slug);

  const { data } = await getCategoryProducts(category, 0, 4);

  const initialProducts = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <ProductsList
        category={category}
        initialProducts={initialProducts}
        totalPages={totalPages}
      />
    </main>
  );
}
