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
    <div className="container px-4 py-8 mx-auto mt-24">
      <section className="mb-12">
        <h1 className="mb-6 text-3xl font-bold">Welcome to Jason</h1>
        <div className="p-8 mb-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
          <h2 className="mb-2 text-2xl font-bold">Summer Sale!</h2>
          <p className="mb-4">Up to 50% off selected items</p>
          <button className="px-6 py-2 font-medium text-blue-600 bg-white rounded-lg">
            Shop Now
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        {status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
