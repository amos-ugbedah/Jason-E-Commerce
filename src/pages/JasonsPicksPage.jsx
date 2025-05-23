import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/jason/ProductCard";
import { toast } from "react-hot-toast";

export default function JasonsPicksPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuratedProducts = async () => {
      try {
        setLoading(true);
        // Get products marked as "staff_pick" or with high ratings
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or("is_staff_pick.eq.true,rating.gte.4.5")
          .order("rating", { ascending: false })
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching picks:", error);
        toast.error("Failed to load Jason's picks");
      } finally {
        setLoading(false);
      }
    };

    fetchCuratedProducts();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">✨ Jason's Picks</h1>
        <p className="mt-2 text-gray-600">
          Hand-selected products by our AI shopping assistant Jason
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">No picks available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="mb-4 text-xl font-semibold">Why These Picks?</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Jason analyzes thousands of data points including customer reviews, 
          product quality, brand reputation, and current trends to bring you 
          only the best selections in each category.
        </p>
      </div>
    </div>
  );
}