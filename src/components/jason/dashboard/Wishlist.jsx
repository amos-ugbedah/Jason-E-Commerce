import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, Heart, ShoppingBag } from "lucide-react";

export default function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data, error } = await supabase
          .from("jason_wishlist")
          .select("*, product:product_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWishlist(data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user.id]);

  const removeFromWishlist = async (itemId) => {
    try {
      const { error } = await supabase
        .from("jason_wishlist")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      setWishlist(wishlist.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <Button onClick={() => navigate("/")} variant="ghost">
          <Home className="mr-2 h-4 w-4" /> Go to Home
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Save items you love to your wishlist to keep them in one place
            </p>
            <Button onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="h-48 bg-gray-100 relative cursor-pointer"
                  onClick={() => navigate(`/products/${item.product.id}`)}
                >
                  {item.product.images && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h3
                    className="font-medium mb-1 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Added on {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">
                      ${item.product.price?.toFixed(2) || "0.00"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/products/${item.product.id}`)
                      }
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}