import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const CheckoutHeader = () => {
  return (
    <main>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-6">
          {/* Logo / App Name */}
          <Link href={"/home"}>
            <h1 className="text-xl font-bold">My E-Commerce App</h1>
          </Link>
          <h1 className="text-xl font-bold">Secure Checkout</h1>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-gray-300"
          >
            <ShoppingCart className="h-7 w-7 mt-2" />
            <span className="mt-4 text-sm font-bold">Cart</span>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default CheckoutHeader;
