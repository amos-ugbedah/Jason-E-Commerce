import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../ui/button";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock_quantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("Session expired. Please login again.");
          navigate("/seller/login");
          return;
        }

        const { data, error } = await supabase
          .from("jason_products")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) throw error || new Error("Product not found");

        const { data: sellerData } = await supabase
          .from("jason_sellers")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (data.seller_id !== sellerData.id) {
          toast.error("You don't have permission to edit this product");
          navigate("/seller/products");
          return;
        }

        setProduct(data);
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description || "",
          category: data.category || "",
          stock_quantity: data.stock_quantity || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(error.message || "Failed to load product");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock_quantity"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const numericData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: formData.stock_quantity
          ? parseInt(formData.stock_quantity)
          : null,
      };

      const { error } = await supabase
        .from("jason_products")
        .update(numericData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Product updated successfully!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 mt-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-700">
            Product not found
          </h3>
          <Button onClick={() => navigate("/seller/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-6 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 bg-white shadow-lg sm:p-6 rounded-xl">
          {/* Header with responsive layout */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="flex-1 text-xl font-bold text-center text-gray-900 sm:text-2xl">
              Edit Product
            </h1>
            <div className="w-[88px] hidden sm:block" /> {/* Spacer */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="price" className="block mb-2 font-medium text-gray-700">
                  Price (NGN) *
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="stock_quantity" className="block mb-2 font-medium text-gray-700">
                  Stock Quantity
                </label>
                <input
                  type="text"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end gap-4 pt-6 border-t border-gray-200 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex items-center">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
