import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/jason/ProductGrid";

export default function SummerSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummerSaleProducts = async () => {
      setLoading(true);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("jason_products")
        .select("*")
        .gte("created_at", oneWeekAgo.toISOString()) // Fetch products from last week
        .gte("discount_percentage", 50); // Products with at least 50% discount

      if (error) {
        console.error("Error fetching Summer Sale products:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchSummerSaleProducts();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <h1 className="mb-6 text-3xl font-bold text-center">
        🔥 Summer Sale – Up to 50% OFF! 🔥
      </h1>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
