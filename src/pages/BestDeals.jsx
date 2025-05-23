import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/jason/ProductGrid";

export default function BestDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestDeals = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("jason_products")
        .select("*")
        .gte("discount_percentage", 50); // Fetch products with 50% off or more

      if (error) {
        console.error("Error fetching best deals:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchBestDeals();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <h1 className="mb-6 text-3xl font-bold text-center">
        💰 Best Deals – Save BIG 💰
      </h1>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
