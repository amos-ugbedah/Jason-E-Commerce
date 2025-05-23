// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { ProductService } from "../services/productService";
import { Product } from "../models/Product";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setProducts(data.map((item) => new Product(item)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getFeaturedProducts();
      return data.map((item) => new Product(item));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      const data = await ProductService.getProductById(id);
      return new Product(data);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchFeaturedProducts,
    getProductById,
    refetch: fetchProducts,
  };
};
