import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../ui/button";
import { PlusCircle, Package, DollarSign, User, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function SellerDashboard() {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [salesData, setSalesData] = useState({ totalSales: 0, orderCount: 0 });
  const [featuredItems, setFeaturedItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    // Show success message if redirected from settings
    if (location.state?.message) {
      toast.success(location.state.message);
    }

    const fetchSellerData = async () => {
      try {
        setLoading(true);
        setStatsLoading(true);

        // Get authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("Session expired. Please login again.");
          navigate("/seller/login");
          return;
        }

        // Fetch seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from("jason_sellers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (sellerError || !sellerData) {
          navigate("/seller/register");
          return;
        }
        setSeller(location.state?.updatedData || sellerData);

        // Fetch seller's products count
        const { count: productCount, error: productsError } = await supabase
          .from("jason_products")
          .select("*", { count: "exact", head: true })
          .eq("seller_id", sellerData.id);

        if (productsError) {
          console.error("Error fetching products:", productsError);
          toast.error("Could not load products");
        }

        // Fetch 3 most recent products for display
        const { data: recentProducts, error: recentProductsError } =
          await supabase
            .from("jason_products")
            .select("id,name,price,cloudinary_urls,created_at")
            .eq("seller_id", sellerData.id)
            .order("created_at", { ascending: false })
            .limit(3);

        if (recentProductsError) {
          console.error("Error fetching recent products:", recentProductsError);
        } else {
          setProducts(recentProducts || []);
        }

        // Fetch seller's sales data
        const { data: salesData, error: salesError } = await supabase
          .from("jason_orders")
          .select("total_amount, status")
          .eq("seller_id", sellerData.id)
          .eq("status", "delivered");

        if (salesError) {
          console.error("Error fetching sales:", salesError);
          toast.error("Could not load sales data");
        } else {
          const total =
            salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
          setSalesData({
            totalSales: total,
            orderCount: salesData?.length || 0,
          });
        }

        // Fetch featured items
        const { data: featuredData, error: featuredError } = await supabase
          .from("jason_categories")
          .select("*")
          .eq("slug", "featured");

        if (featuredError) {
          console.error("Error fetching featured items:", featuredError);
        } else {
          setFeaturedItems(featuredData || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchSellerData();
  }, [navigate, location.state]);

  const handleFeaturedItemClick = (item) => {
    navigate(`/categories/${item.slug}`, { state: { category: item } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-700">
            Seller profile not found
          </h3>
          <Button onClick={() => navigate("/seller/register")}>
            Register as Seller
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Seller Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {seller.business_name || "Seller"}
              </p>
            </div>
            <Button
              onClick={() => navigate("/seller/products/new")}
              className="flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <div className="p-4 rounded-lg shadow-md bg-blue-50">
              <div className="flex items-center">
                <Package className="w-6 h-6 mr-3 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-600">Total Products</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? "--" : products.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-green-50">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-600">Total Sales</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? "--" : formatCurrency(salesData.totalSales)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {salesData.orderCount} completed orders
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-purple-50">
              <div className="flex items-center">
                <User className="w-6 h-6 mr-3 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-600">Account Status</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {seller.approved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-yellow-600">Pending Approval</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Products
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/seller/products")}
                >
                  View All Products
                </Button>
                <Button
                  onClick={() => navigate("/seller/products/new")}
                  size="sm"
                  className="flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="mt-4 mb-2 text-lg font-medium text-gray-700">
                  No products listed yet
                </h3>
                <Button onClick={() => navigate("/seller/products/new")}>
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 transition-shadow border border-gray-200 rounded-lg cursor-pointer hover:shadow-xl hover:bg-gray-50"
                    onClick={() => navigate(`/seller/products/${product.id}`)}
                  >
                    <div className="mb-3 overflow-hidden bg-gray-100 rounded-lg aspect-square">
                      {product.cloudinary_urls?.[0] ? (
                        <img
                          src={product.cloudinary_urls[0]}
                          alt={product.name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/seller/products/${product.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Items Section */}
          {featuredItems.length > 0 && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Featured Items
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {featuredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 transition-all border rounded-lg cursor-pointer hover:shadow-md"
                    onClick={() => handleFeaturedItemClick(item)}
                  >
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-gray-600">Business Name</h3>
              <p className="text-gray-800">
                {seller.business_name || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-600">
                Business Address
              </h3>
              {seller.business_address ? (
                <>
                  <p className="text-gray-800">
                    {seller.business_address.street || "Not provided"}
                  </p>
                  <p className="text-gray-800">
                    {seller.business_address.city},{" "}
                    {seller.business_address.state}
                  </p>
                  <p className="text-gray-800">
                    {seller.business_address.country}
                  </p>
                </>
              ) : (
                <p className="text-gray-800">Address not provided</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-600">Bank Details</h3>
              {seller.bank_account_details ? (
                <>
                  <p className="text-gray-800">
                    {seller.bank_account_details.bank_name ||
                      "Bank not specified"}
                  </p>
                  <p className="text-gray-800">
                    {seller.bank_account_details.account_name ||
                      "Name not specified"}
                  </p>
                  <p className="text-gray-800">
                    {seller.bank_account_details.account_number
                      ? `•••• ${seller.bank_account_details.account_number.slice(
                          -4
                        )}`
                      : "Account not specified"}
                  </p>
                </>
              ) : (
                <p className="text-gray-800">Bank details not provided</p>
              )}
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => navigate("/seller/settings")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}