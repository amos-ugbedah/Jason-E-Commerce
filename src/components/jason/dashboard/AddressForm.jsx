import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Button } from "../../../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddressForm() {
  const { user } = useOutletContext();
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    phone_number: "",
    is_default: false,
  });

  useEffect(() => {
    if (!isEditing) return;

    const fetchAddress = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jason_addresses")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setFormData(data);
      } catch (error) {
        console.error("Error fetching address:", error);
        toast.error("Failed to load address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.line1 ||
        !formData.city ||
        !formData.state ||
        !formData.postal_code
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.is_default) {
        // First, set all addresses to not default
        await supabase
          .from("jason_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (isEditing) {
        // Update existing address
        const { error } = await supabase
          .from("jason_addresses")
          .update(formData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Address updated successfully!");
      } else {
        // Create new address
        const { error } = await supabase
          .from("jason_addresses")
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast.success("Address added successfully!");
      }

      navigate("/dashboard/addresses");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto">
      <Button
        onClick={() => navigate("/dashboard/addresses")}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Addresses
      </Button>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-6 text-xl font-bold">
          {isEditing ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Address Name (e.g., Home, Work)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Home"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              name="line1"
              value={formData.line1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Apt, Suite, etc. (Optional)
            </label>
            <input
              type="text"
              name="line2"
              value={formData.line2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                ZIP Code *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/addresses")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isEditing ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
