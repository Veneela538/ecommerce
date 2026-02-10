import { getDictionary } from "@/lib/dictionaries";

export default async function Footer() {
  const dict = await getDictionary("en");

  return (
    <footer className="bg-gray-900 text-white p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()}
        {dict.footer.body}
      </div>
    </footer>
  );
}
