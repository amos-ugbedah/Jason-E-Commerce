import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/jason/ProductCard";
import { toast } from "react-hot-toast";

export default function DailyDealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        // Get products added in last 48 hours
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .gte("created_at", fortyEightHoursAgo)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast.error("Failed to load daily deals");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">🔥 Daily Deals</h1>
        <p className="mt-2 text-gray-600">
          Fresh products added in the last 48 hours - grab them before they're gone!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">No new deals available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}