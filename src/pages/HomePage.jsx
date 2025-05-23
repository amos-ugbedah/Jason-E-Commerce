import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../features/products/productsSlice";
import ProductCard from "../components/jason/ProductCard";

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredProducts, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Welcome to Jason</h1>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-2">Summer Sale!</h2>
          <p className="mb-4">Up to 50% off selected items</p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium">
            Shop Now
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
