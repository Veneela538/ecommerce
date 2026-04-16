import { getDictionary } from "@/lib/dictionaries";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CheckoutHeader = async () => {
  const dict = await getDictionary("en");
  return (
    <main>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-6">
          {/* Logo / App Name */}
          <a href="/home">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={120}
              height={40}
              className="cursor-pointer"
              unoptimized
            />
          </a>
          <h1 className="text-xl font-bold">{dict.checkout.header.title}</h1>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-gray-300"
          >
            <ShoppingCart className="h-7 w-7 mt-2" />
            <span className="mt-4 text-sm font-bold">
              {dict.checkout.header.cart}
            </span>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default CheckoutHeader;
