import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/jason/ProductCard";

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!searchQuery || searchQuery.trim() === "") {
          setResults([]);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from("jason_products")
          .select("*")
          .or(
            `name.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%, category.ilike.%${searchQuery}%`
          )
          .order("created_at", { ascending: false });

        if (supabaseError) throw supabaseError;

        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : "Search products"}
      </h1>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading results...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-100 rounded">
          Error: {error}
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-gray-600 bg-gray-100 rounded">
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : "Please enter a search term"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
