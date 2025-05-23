import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: {
          ...product,
          freeDelivery: product.free_delivery || product.freeDelivery || false,
          stock: product.stock ?? product.quantity ?? 0,  // add stock info if available
        },
        quantity: 1,
      })
    );
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="overflow-hidden transition-shadow bg-white border shadow-sm rounded-xl hover:shadow-md">
        <div className="relative pb-[100%]">
          <img
            src={product.cloudinary_urls?.[0] || product.image_url}
            alt={product.name}
            className="absolute object-cover w-full h-full"
          />
          {product.discount_price && (
            <div className="absolute px-2 py-1 text-xs font-bold text-white rounded top-2 right-2 bg-rose-500">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex mr-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating || 0) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.review_count || 0})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.discount_price ? (
                <>
                  <span className="font-bold text-rose-600">
                    ${product.discount_price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="text-gray-400 transition-colors hover:text-blue-600"
              aria-label="Add to cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
