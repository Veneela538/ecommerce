"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} My E-Commerce App. All rights reserved.
      </div>
    </footer>
  );
}
