import { getCategories } from "@/actions/categories/categories";
import getCategoryProducts from "@/actions/categories/category-products";
import Chatbot from "@/components/chatbot";
import { ProductsList } from "@/components/home/products-list";

const Home = async () => {
  const { data } = await getCategories();

  const categoryData = await Promise.all(
    data.map(async (category: string) => {
      const res = await getCategoryProducts(category, 0, 4);

      return {
        category,
        initialProducts: res?.data?.content || [],
        totalPages: res?.data?.totalPages || 1,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      {categoryData.map(({ category, initialProducts, totalPages }, index) => (
        <div key={index}>
          <ProductsList
            category={category}
            initialProducts={initialProducts}
            totalPages={totalPages}
          />
          <br />
        </div>
      ))}
      <Chatbot />
    </main>
  );
};

export default Home;
