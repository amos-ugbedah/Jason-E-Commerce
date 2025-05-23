import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../features/cart/cartSlice";

const CartItem = ({ item, currency, formatCurrency }) => {
  const dispatch = useDispatch();

  if (!item) return null;

  // Handle both item.product and direct item properties
  const product = item.product || item;
  const itemPrice = product?.price || 0;
  const itemQuantity = item?.quantity || 1;
  const itemTotal = itemPrice * itemQuantity;
  const itemName = product?.name || "Unnamed Product";
  const itemImage = product?.imageUrl || product?.cloudinary_urls?.[0];

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      dispatch(
        updateQuantity({
          id: product.id,
          quantity: Math.max(1, newQuantity),
        })
      );
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4 px-2 md:px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-md mr-4 flex-shrink-0">
        <img
          src={itemImage || "/images/placeholder-product.jpg"}
          alt={itemName}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.jpg";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-semibold text-gray-800 truncate">
          {itemName}
        </h4>

        <div className="text-sm">
          <p className="text-gray-500">
            {formatCurrency(itemPrice)}
            {currency !== "USD" && (
              <span className="text-xs text-gray-400 ml-1">
                (${itemPrice.toFixed(2)})
              </span>
            )}
          </p>
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <label className="text-sm text-gray-600">Qty:</label>
          <input
            type="number"
            min="1"
            value={itemQuantity}
            onChange={handleQuantityChange}
            className="w-16 border rounded px-2 py-1 text-sm text-center"
          />
        </div>

        <p className="text-sm text-gray-600 mt-1">
          Item Total: {formatCurrency(itemTotal)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium"
        aria-label="Remove item"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
