import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "../../../ui/button";
import { ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentMethodForm() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    card_holder: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    type: "visa",
    is_default: false,
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.card_holder)
      newErrors.card_holder = "Card holder name is required";
    if (!formData.card_number || formData.card_number.length < 16)
      newErrors.card_number = "Valid card number is required";
    if (!formData.expiry_month || !formData.expiry_year)
      newErrors.expiry = "Expiry date is required";
    if (!formData.cvv || formData.cvv.length < 3)
      newErrors.cvv = "CVV is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setProcessing(true);
      setErrors({});

      // Determine card type based on number
      const cardType = determineCardType(formData.card_number);

      const { error } = await supabase.from("jason_payment_methods").insert([
        {
          user_id: user.id,
          card_holder: formData.card_holder,
          card_number: formData.card_number,
          expiry_month: formData.expiry_month,
          expiry_year: formData.expiry_year,
          type: cardType,
          is_default: formData.is_default,
          last_four: formData.card_number.slice(-4),
        },
      ]);

      if (error) throw error;

      toast.success("Payment method added successfully");
      navigate("/dashboard/payment-methods");
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error(error.message || "Failed to add payment method");
    } finally {
      setProcessing(false);
    }
  };

  const determineCardType = (number) => {
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6(?:011|5)/.test(number)) return "discover";
    return "other";
  };

  return (
    <div className="max-w-md px-4 py-8 mx-auto">
      <Button
        onClick={() => navigate("/dashboard/payment-methods")}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payment Methods
      </Button>

      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center mb-6 space-x-3">
          <CreditCard className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Add New Payment Method</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            <input
              type="text"
              name="card_holder"
              value={formData.card_holder}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.card_holder ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.card_holder && (
              <p className="mt-1 text-sm text-red-500">{errors.card_holder}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleChange}
              maxLength={16}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.card_number ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="4242 4242 4242 4242"
            />
            {errors.card_number && (
              <p className="mt-1 text-sm text-red-500">{errors.card_number}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="expiry_month"
                  value={formData.expiry_month}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="MM"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <input
                  type="text"
                  name="expiry_year"
                  value={formData.expiry_year}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="YY"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.expiry && (
                <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={4}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.cvv ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="123"
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="default-method"
              name="is_default"
              checked={formData.is_default}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_default: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="default-method"
              className="ml-2 text-sm text-gray-700"
            >
              Set as default payment method
            </label>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={processing} className="w-full">
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save Payment Method
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
