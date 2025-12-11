import { ProductsList } from "@/components/home/products-list";

export default async function CategoryProductList({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div>
        <ProductsList category={category} />
      </div>
    </main>
  );
}
