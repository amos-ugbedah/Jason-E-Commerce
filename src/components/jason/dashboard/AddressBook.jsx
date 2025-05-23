import { useEffect, useState } from "react";
import { useOutletContext, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "../../../ui/button";
import { Plus, Home, Trash2, Loader2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddressBook() {
  const context = useOutletContext();
  const user = context?.user; // Safely access user from context
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setError("User not available");
      setLoading(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("jason_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (fetchError) throw fetchError;

        setAddresses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Failed to load addresses");
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.id]); // Only run when user.id changes

  const setDefaultAddress = async (addressId) => {
    if (!user?.id) {
      toast.error("User not available");
      return;
    }

    try {
      setProcessing(true);

      // First, set all addresses to not default
      const { error: clearError } = await supabase
        .from("jason_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (clearError) throw clearError;

      // Then set the selected address as default
      const { error } = await supabase
        .from("jason_addresses")
        .update({ is_default: true })
        .eq("id", addressId);

      if (error) throw error;

      // Update local state
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        }))
      );
      toast.success("Default address updated");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address");
    } finally {
      setProcessing(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!user?.id) {
      toast.error("User not available");
      return;
    }

    try {
      setProcessing(true);
      const isDefault = addresses.find((a) => a.id === addressId)?.is_default;

      const { error } = await supabase
        .from("jason_addresses")
        .delete()
        .eq("id", addressId);

      if (error) throw error;

      // Update UI
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId
      );
      setAddresses(updatedAddresses);

      // If deleted default, set a new one if available
      if (isDefault && updatedAddresses.length > 0) {
        await setDefaultAddress(updatedAddresses[0].id);
      }

      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">User not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please sign in to manage your addresses
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Error loading addresses
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-500">Manage your shipping addresses</p>
        </div>
        <Button onClick={() => navigate("add")} disabled={processing}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <Home size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No addresses saved
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first address to get started
            </p>
            <Button
              onClick={() => navigate("add")}
              className="mt-4"
              disabled={processing}
            >
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg relative ${
                  address.is_default
                    ? "border-blue-500 border-2"
                    : "border-gray-200"
                }`}
              >
                {address.is_default && (
                  <span className="absolute px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded -top-2 -left-2">
                    DEFAULT
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">
                    {address.name || "Shipping Address"}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`${address.id}/edit`)}
                      className="text-gray-500 hover:text-blue-500"
                      disabled={processing}
                      aria-label="Edit address"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this address?"
                          )
                        ) {
                          deleteAddress(address.id);
                        }
                      }}
                      className="text-gray-500 hover:text-red-500"
                      disabled={processing}
                      aria-label="Delete address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  {address.line1 || "Address line 1"}
                </p>
                {address.line2 && (
                  <p className="text-gray-700">{address.line2}</p>
                )}
                <p className="text-gray-700">
                  {address.city || "City"}, {address.state || "State"}{" "}
                  {address.postal_code || "Postal code"}
                </p>
                <p className="text-gray-700">{address.country || "Country"}</p>
                <p className="mt-2 text-gray-700">
                  Phone: {address.phone_number || "Not provided"}
                </p>

                {!address.is_default && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                      disabled={processing}
                    >
                      {processing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Set as Default
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render nested routes (AddressForm) */}
      <Outlet context={{ user, addresses, setAddresses }} />
    </div>
  );
}
