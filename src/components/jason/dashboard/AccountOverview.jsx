import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../ui/button";
import { Home } from "lucide-react";

export default function AccountOverview({ profile }) {
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders count
        const { count: orders } = await supabase
          .from("jason_orders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.user_id);

        // Fetch wishlist count
        const { count: wishlist } = await supabase
          .from("jason_wishlist")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.user_id);

        setOrdersCount(orders || 0);
        setWishlistCount(wishlist || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile.user_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Account Overview</h1>
        <Button onClick={() => navigate("/")} variant="ghost">
          <Home className="mr-2 h-4 w-4" /> Go to Home
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Welcome Back, {profile.full_name || "User"}!</h2>
        <p className="text-gray-600 mb-6">
          Here's what's happening with your Jason account today.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-1">Orders</h3>
            <p className="text-2xl font-bold">{ordersCount}</p>
            <p className="text-sm text-blue-600">Track your orders</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-medium text-green-800 mb-1">Wishlist</h3>
            <p className="text-2xl font-bold">{wishlistCount}</p>
            <p className="text-sm text-green-600">Items saved for later</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-1">Loyalty</h3>
            <p className="text-2xl font-bold">{profile?.loyalty_points || 0}</p>
            <p className="text-sm text-purple-600 capitalize">
              {profile?.loyalty_tier || "bronze"} member
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-sm">You joined Jason {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {ordersCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm">You've placed {ordersCount} order{ordersCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}