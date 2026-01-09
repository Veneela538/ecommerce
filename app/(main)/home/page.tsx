import { getCategories } from "@/actions/categories/categories";
import Chatbot from "@/components/chatbot";
import { ProductsList } from "@/components/home/products-list";

const Home = async () => {
  const { data } = await getCategories();

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      {data.map((category: string, index: number) => (
        <div key={index}>
          <ProductsList category={category} key={index} />
          <br />
        </div>
      ))}
      <Chatbot />
    </main>
  );
};

export default Home;
