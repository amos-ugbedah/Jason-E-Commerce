/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/jason/CheckoutSteps";
import PaymentOptions from "../features/checkout/PaymentForm";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.discount_price || item.product.price) * item.quantity,
    0
  );

  const steps = [
    { id: 1, name: "Shipping", status: step >= 1 ? "current" : "upcoming" },
    { id: 2, name: "Payment", status: step >= 2 ? "current" : "upcoming" },
    { id: 3, name: "Confirmation", status: step >= 3 ? "current" : "upcoming" },
  ];

  // New function: update product stock on backend after successful payment
  const updateStock = async () => {
    try {
      // Assuming your API endpoint to update stock is:
      // PUT /api/products/:id/stock
      // with body { quantity: numberToReduce }

      const updatePromises = items.map((item) =>
        fetch(`/api/products/${item.product.id}/stock`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: item.quantity }), // quantity to reduce
        })
      );

      const responses = await Promise.all(updatePromises);

      // Optionally, check if all responses are ok
      for (const res of responses) {
        if (!res.ok) {
          throw new Error("Failed to update stock for one or more items.");
        }
      }
    } catch (error) {
      console.error("Stock update error:", error);
      throw error; // re-throw to handle outside
    }
  };

  // Handler to call on payment success
  const handlePaymentSuccess = async () => {
    try {
      await updateStock(); // update stock first
      setStep(3); // then move to confirmation
    } catch (error) {
      alert(
        "Sorry, we couldn't update product stock. Please contact support or try again."
      );
      // optionally stay on payment step or handle as you want
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <CheckoutSteps steps={steps} currentStep={step} />

      <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-6 text-xl font-bold">Shipping Information</h2>
              <form>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      defaultValue={
                        user?.user_metadata?.full_name?.split(" ")[0] || ""
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      defaultValue={
                        user?.user_metadata?.full_name?.split(" ")[1] || ""
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue={user?.email || ""}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">State</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">ZIP Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && <PaymentOptions onSuccess={handlePaymentSuccess} />}

          {step === 3 && (
            <div className="p-6 text-center bg-white border shadow-sm rounded-xl">
              <div className="mb-4 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold">Order Confirmed!</h2>
              <p className="mb-6 text-gray-600">
                Thank you for your purchase. Your order has been received and is
                being processed. A confirmation email has been sent to {user?.email}.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="/dashboard/orders"
                  className="inline-block px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  View Your Orders
                </a>
                <a
                  href="/"
                  className="inline-block px-6 py-2 font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border shadow-sm rounded-xl h-fit">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="mb-6 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 overflow-hidden bg-gray-100 rounded-lg">
                    <img
                      src={item.product.cloudinary_urls[0]}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">
                  ₦
                  {(
                    (item.product.discount_price || item.product.price) *
                    item.quantity
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-3 border-t">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>₦{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
