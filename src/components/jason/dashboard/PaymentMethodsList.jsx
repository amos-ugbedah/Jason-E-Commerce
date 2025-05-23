import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "../../../ui/button";
import { Plus, CreditCard, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentMethodsList() {
  const { user } = useOutletContext();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);

        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !currentUser)
          throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("jason_payment_methods")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPaymentMethods(data || []);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error(error.message);
        if (error.message === "User not authenticated") navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [navigate, user?.id]);

  const setDefaultMethod = async (methodId) => {
    try {
      setProcessing(true);

      // Reset all defaults first
      const { error: clearError } = await supabase
        .from("jason_payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id);
      if (clearError) throw clearError;

      // Set new default
      const { error } = await supabase
        .from("jason_payment_methods")
        .update({
          is_default: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", methodId);
      if (error) throw error;

      // Update UI
      setPaymentMethods(
        paymentMethods.map((method) => ({
          ...method,
          is_default: method.id === methodId,
        }))
      );
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error(error.message || "Failed to update default payment method");
    } finally {
      setProcessing(false);
    }
  };

  const deleteMethod = async (methodId) => {
    try {
      setProcessing(true);
      const isDefault = paymentMethods.find(
        (m) => m.id === methodId
      )?.is_default;

      const { error } = await supabase
        .from("jason_payment_methods")
        .delete()
        .eq("id", methodId);
      if (error) throw error;

      // Update UI
      const updatedMethods = paymentMethods.filter(
        (method) => method.id !== methodId
      );
      setPaymentMethods(updatedMethods);

      // If deleted default, set a new one
      if (isDefault && updatedMethods.length > 0) {
        await setDefaultMethod(updatedMethods[0].id);
      }

      toast.success("Payment method removed");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error(error.message || "Failed to remove payment method");
    } finally {
      setProcessing(false);
    }
  };

  const getCardIcon = (type) => {
    const baseClasses = "w-8 h-8 p-1 rounded-md";
    switch (type?.toLowerCase()) {
      case "visa":
        return (
          <div className={`${baseClasses} bg-blue-500 text-white`}>
            <CreditCard size={20} />
          </div>
        );
      case "mastercard":
        return (
          <div className={`${baseClasses} bg-red-500 text-white`}>
            <CreditCard size={20} />
          </div>
        );
      case "amex":
        return (
          <div className={`${baseClasses} bg-green-500 text-white`}>
            <CreditCard size={20} />
          </div>
        );
      case "discover":
        return (
          <div className={`${baseClasses} bg-orange-500 text-white`}>
            <CreditCard size={20} />
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-500 text-white`}>
            <CreditCard size={20} />
          </div>
        );
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "";
    const lastFour = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const formatExpiry = (month, year) => {
    if (!month || !year) return "";
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-500">Manage your saved payment methods</p>
        </div>
        <Button
          onClick={() => navigate("add")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Payment Method
        </Button>
      </div>

      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No payment methods
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new payment method.
            </p>
            <Button onClick={() => navigate("add")} className="mt-4">
              Add Payment Method
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                className={`py-4 px-4 hover:bg-gray-50 rounded-lg ${
                  method.is_default ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getCardIcon(method.type)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.card_holder}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-sm text-gray-500">
                          {maskCardNumber(method.card_number)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Expires{" "}
                          {formatExpiry(
                            method.expiry_month,
                            method.expiry_year
                          )}
                        </span>
                        {method.is_default && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        onClick={() => setDefaultMethod(method.id)}
                        disabled={processing}
                      >
                        {processing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Set as Default"
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => deleteMethod(method.id)}
                      disabled={processing}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
