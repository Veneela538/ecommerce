import React from "react";

const HomePage: React.FC = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome to Our E-commerce Store</h1>
      <p>Discover the best products at unbeatable prices.</p>
      <section>
        <h2>Featured Products</h2>
        {/* Replace with dynamic product listing */}
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <img src="/images/product1.jpg" alt="Product 1" width={150} />
            <h3>Product 1</h3>
            <p>$19.99</p>
          </div>
          <div>
            <img src="/images/product2.jpg" alt="Product 2" width={150} />
            <h3>Product 2</h3>
            <p>$29.99</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
