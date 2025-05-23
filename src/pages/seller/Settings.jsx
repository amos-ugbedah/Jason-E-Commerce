import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SellerSettings() {
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("No authenticated user found");

        const { data, error } = await supabase
          .from("jason_sellers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        // Initialize empty object if no seller data exists
        const initialData = data || {
          business_name: "",
          business_email: "",
          business_phone: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          bank_name: "",
          account_number: "",
          account_name: "",
          routing_number: ""
        };

        setSellerData(initialData);
        reset(initialData);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to load seller data");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      // Prepare data for upsert
      const payload = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("jason_sellers")
        .upsert(payload)
        .select();

      if (error) throw error;

      toast.success("Settings saved successfully!");
      setSellerData(data[0]);
      reset(data[0]);
      
      // Redirect to seller dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/seller/dashboard", { 
          state: { 
            message: "Settings updated successfully",
            updatedData: data[0]
          } 
        });
      }, 1500);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sellerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Seller Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Business Information */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold">Business Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  {...register("business_name", {
                    required: "Business name is required",
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Business Email
                </label>
                <input
                  type="email"
                  {...register("business_email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                {errors.business_email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.business_email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Business Phone
                </label>
                <input
                  type="tel"
                  {...register("business_phone", {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                      message: "Invalid phone number"
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                {errors.business_phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.business_phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold">Address Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    State/Province
                  </label>
                  <input
                    type="text"
                    {...register("state")}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...register("postal_code")}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    {...register("country")}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="NG">Nigeria</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Bank Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                {...register("bank_name")}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                {...register("account_number", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers are allowed"
                  }
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              {errors.account_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.account_number.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Account Name
              </label>
              <input
                type="text"
                {...register("account_name")}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Routing Number/SWIFT
              </label>
              <input
                type="text"
                {...register("routing_number")}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}