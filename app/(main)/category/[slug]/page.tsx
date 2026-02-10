import { ProductsList } from "@/components/home/products-list";
import { unslugify } from "@/lib/utils";

export default async function CategoryProductList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div>
        <ProductsList category={unslugify(slug)} />
      </div>
    </main>
  );
}
