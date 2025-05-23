import { useSelector } from "react-redux";
import { X, Plus, Minus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartPreview() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isAnimating, setIsAnimating] = useState(false);
  const [total, setTotal] = useState(0);

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Shopping Cart</h2>
        <span className="text-sm text-gray-500">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mt-1">Start shopping to add items</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex gap-4 border-b pb-4 last:border-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image || "/images/placeholder-product.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <button
                        className="text-gray-400 hover:text-red-500 transition"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isAnimating
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={handleCheckout}
            >
              {isAnimating ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  function handleRemoveItem(productId) {
    // Dispatch remove item action
    console.log("Remove item:", productId);
  }

  function handleIncreaseQuantity(productId) {
    // Dispatch increase quantity action
    console.log("Increase quantity:", productId);
  }

  function handleDecreaseQuantity(productId) {
    // Dispatch decrease quantity action
    console.log("Decrease quantity:", productId);
  }

  function handleCheckout() {
    setIsAnimating(true);
    // Simulate processing animation
    setTimeout(() => {
      setIsAnimating(false);
      // Navigate to checkout page
      console.log("Proceeding to checkout");
    }, 1500);
  }
}
