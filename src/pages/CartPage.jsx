import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartCurrency,
  selectSubtotal,
  selectDeliveryFee,
  selectTotal,
  selectExchangeRates,
  setCurrency,
  updateExchangeRates,
} from "../features/cart/cartSlice";
import CartItem from "../components/jason/CartItem";

const EXCHANGE_API_URL = "https://api.exchangerate-api.com/v4/latest/NGN";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const currency = useSelector(selectCartCurrency);
  const subtotal = useSelector(selectSubtotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const total = useSelector(selectTotal);
  const exchangeRates = useSelector(selectExchangeRates);

  const [voucherCode, setVoucherCode] = useState("");

  // Fetch exchange rates every 5 minutes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(EXCHANGE_API_URL);
        const data = await response.json();

        dispatch(
          updateExchangeRates({
            rates: data.rates,
            lastRateUpdate: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        // Fallback rates for consistency
        dispatch(
          updateExchangeRates({
            rates: {
              USD: 0.00067,
              EUR: 0.00062,
              GBP: 0.00053,
              GHS: 0.008,
              JPY: 0.1,
              NGN: 1,
            },
            lastRateUpdate: new Date().toISOString(),
          })
        );
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [dispatch]);

  // Formats amount with selected currency symbol
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const symbols = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      GHS: "₵",
      JPY: "¥",
    };

    return formatter
      .format(amount)
      .replace(/[A-Z]{3}/, symbols[currency] || currency);
  };

  const handleApplyVoucher = () => {
    // Voucher logic TODO
    console.log("Voucher applied:", voucherCode);
  };

  return (
    <div className="container max-w-full px-4 py-8 mx-auto overflow-x-hidden">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl md:mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p>Your cart is empty</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
          {/* Cart Items and Currency Selector */}
          <section className="w-full md:col-span-2" aria-label="Cart Items and Currency Selection">
            <div className="p-4 mb-6 rounded-lg bg-gray-50">
              <label htmlFor="currency-select" className="block mb-2 text-sm font-medium">
                Select Currency:
              </label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => dispatch(setCurrency(e.target.value))}
                className="w-full p-2 border rounded"
                aria-describedby="rate-update-info"
              >
                <option value="NGN">Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="GHS">Ghana Cedi (₵)</option>
                <option value="JPY">Japanese Yen (¥)</option>
              </select>
              <p
                id="rate-update-info"
                className="mt-1 text-xs text-gray-500"
              >
                Rates updated:{" "}
                {exchangeRates.lastRateUpdate
                  ? new Date(exchangeRates.lastRateUpdate).toLocaleString()
                  : "Loading..."}
              </p>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4" aria-live="polite" aria-relevant="additions removals">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  currency={currency}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <aside
            className="w-full p-4 rounded-lg bg-gray-50 md:p-6 md:w-auto"
            aria-label="Order Summary"
          >
            <h2 className="mb-4 text-lg font-bold md:text-xl">Order Summary</h2>

            <div className="mb-4 space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span>
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? "Free Delivery" : formatCurrency(deliveryFee)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-base font-bold md:text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 p-2 text-sm border rounded-l md:text-base"
                  aria-label="Voucher code"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-3 py-2 text-sm bg-gray-200 rounded-r md:px-4 md:text-base"
                  aria-label="Apply voucher"
                >
                  Apply
                </button>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-2 text-sm text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 md:py-3 md:text-base"
              >
                Proceed to Checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
