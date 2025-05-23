import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { FlutterWaveButton } from "flutterwave-react-v3"; // Updated import
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../cart/cartSlice";

const PaymentOptions = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [loading, setLoading] = useState(false);
  // Removed unused error state

  const totalAmount = items.reduce((total, item) => {
    return (
      total +
      (item.product.discount_price || item.product.price) * item.quantity
    );
  }, 0);

  // Paystack Configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.email || "customer@example.com",
    amount: totalAmount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Products",
          variable_name: "products",
          value: items.map((item) => item.product.name).join(", "),
        },
      ],
    },
  };

  const initializePaystackPayment = usePaystackPayment(paystackConfig);

  // Flutterwave Configuration
  const flutterwaveConfig = {
    tx_ref: Date.now().toString(),
    amount: totalAmount,
    currency: "NGN",
    payment_options: "card",
    customer: {
      email: user?.email || "customer@example.com",
      name: user?.user_metadata?.full_name || "Customer",
    },
    customizations: {
      title: "Your Store Name",
      description: "Payment for items",
      logo: "https://your-logo.png",
    },
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
  };

  const onPaystackSuccess = (response) => {
    console.log("Paystack Success:", response);
    dispatch(clearCart());
    onSuccess();
  };

  const onPaystackClose = () => {
    console.log("Paystack payment closed");
  };

  const onFlutterwaveClose = () => {
    console.log("Flutterwave payment closed");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Payment Information</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("paystack")}
            className={`px-4 py-2 rounded-lg border ${
              paymentMethod === "paystack"
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            Paystack
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("flutterwave")}
            className={`px-4 py-2 rounded-lg border ${
              paymentMethod === "flutterwave"
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            Flutterwave
          </button>
        </div>
      </div>

      {/* Removed unused error display */}

      {paymentMethod === "paystack" ? (
        <button
          onClick={() => {
            setLoading(true);
            initializePaystackPayment(onPaystackSuccess, onPaystackClose);
          }}
          disabled={loading}
          className="btn-primary w-full py-3 bg-green-600 hover:bg-green-700"
        >
          {loading
            ? "Processing..."
            : `Pay ₦${totalAmount.toFixed(2)} with Paystack`}
        </button>
      ) : (
        <FlutterWaveButton
          {...flutterwaveConfig}
          callback={(response) => {
            console.log("Flutterwave Success:", response);
            dispatch(clearCart());
            onSuccess();
          }}
          onClose={onFlutterwaveClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          text={`Pay ₦${totalAmount.toFixed(2)} with Flutterwave`}
        />
      )}
    </div>
  );
};

export default PaymentOptions;
