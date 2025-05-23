import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/jason/ProductGrid";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      const seventyTwoHoursAgo = new Date();
      seventyTwoHoursAgo.setDate(seventyTwoHoursAgo.getDate() - 3); // Last 72 hours

      const { data, error } = await supabase
        .from("jason_products")
        .select("*")
        .gte("created_at", seventyTwoHoursAgo.toISOString());

      if (error) {
        console.error("Error fetching new arrivals:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <h1 className="mb-6 text-3xl font-bold text-center">
        🚀 New Arrivals – Fresh & Trending 🚀
      </h1>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
