// src/components/ProductList.js
import React from 'react';

const ProductList = () => {
  const products = [
    { id: 1, name: "Product 1", price: 199, image: "/product1.jpg" },
    { id: 2, name: "Product 2", price: 299, image: "/product2.jpg" },
    { id: 3, name: "Product 3", price: 99, image: "/product3.jpg" },
    { id: 4, name: "Product 4", price: 149, image: "/product4.jpg" },
  ];

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-brandRed">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="mt-1 text-brandOrange font-bold">₹{product.price}</p>
            <button className="mt-3 bg-brandRed text-white px-4 py-2 rounded hover:bg-red-600">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
