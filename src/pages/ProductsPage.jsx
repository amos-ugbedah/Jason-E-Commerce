// src/pages/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import ProductGrid from "../components/jason/ProductGrid";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Initialize sortedProducts with the original products when they load
    if (products.length > 0) {
      setSortedProducts([...products]);
    }
  }, [products]);

  useEffect(() => {
    // Apply both sorting and filtering whenever the options change
    let result = [...products];

    // Apply filter first
    if (filterOption === "On Sale") {
      result = result.filter(product => product.discountPercentage > 0);
    } else if (filterOption === "In Stock") {
      result = result.filter(product => product.stock > 0);
    }

    // Then apply sorting
    if (sortOption === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setSortedProducts(result);
  }, [sortOption, filterOption, products]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex space-x-4">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="">Sort by</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Rating">Rating</option>
          </select>
          <select 
            className="px-3 py-2 border rounded-lg"
            value={filterOption}
            onChange={handleFilterChange}
          >
            <option value="">Filter</option>
            <option value="On Sale">On Sale</option>
            <option value="In Stock">In Stock</option>
          </select>
        </div>
      </div>

      {status === "loading" && (
        <div className="py-8 text-center">Loading products...</div>
      )}
      {error && <div className="py-4 text-center text-red-500">{error}</div>}
      {status === "succeeded" && (
        <ProductGrid products={sortedProducts.length > 0 ? sortedProducts : products} />
      )}
    </div>
  );
}