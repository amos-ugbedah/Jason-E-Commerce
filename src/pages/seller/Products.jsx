import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../ui/button";
import { PlusCircle, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SellerProducts() {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("Session expired. Please login again.");
          navigate("/seller/login");
          return;
        }

        const { data: sellerData, error: sellerError } = await supabase
          .from("jason_sellers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (sellerError || !sellerData) {
          navigate("/seller/register");
          return;
        }
        setSeller(sellerData);

        const { data: sellerProducts, error: productsError } = await supabase
          .from("jason_products")
          .select("id, name, price, description, cloudinary_urls, created_at, updated_at")
          .eq("seller_id", sellerData.id)
          .order("created_at", { ascending: false });

        if (productsError) {
          console.error("Error fetching products:", productsError);
          toast.error("Could not load products");
        } else {
          setProducts(sellerProducts || []);
        }

      } catch (error) {
        console.error("Products page error:", error);
        toast.error(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-600">Loading your products...</p>
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
        {/* Back to Dashboard Button */}
        <div>
          <Button variant="outline" onClick={() => navigate("/seller/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Products</h1>
              <p className="text-sm text-gray-500">
                Manage all products for {seller.business_name || 'your business'}
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

          {products.length === 0 ? (
            <div className="py-12 text-center border border-gray-200 rounded-lg">
              <Package className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 mb-2 text-lg font-medium text-gray-700">
                No products listed yet
              </h3>
              <p className="max-w-md mx-auto mb-4 text-gray-500">
                You haven't added any products yet. Click the button below to add your first product.
              </p>
              <Button onClick={() => navigate("/seller/products/new")}>
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-lg hover:bg-gray-50"
                >
                  <div 
                    className="mb-3 overflow-hidden bg-gray-100 rounded-lg cursor-pointer aspect-square"
                    onClick={() => navigate(`/seller/products/${product.id}`)}
                  >
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
                  <h3 
                    className="font-medium text-gray-800 cursor-pointer hover:underline"
                    onClick={() => navigate(`/seller/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
