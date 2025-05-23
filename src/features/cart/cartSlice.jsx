import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cartState");
    return savedCart
      ? JSON.parse(savedCart)
      : {
          items: [],
          voucherDiscount: 0,
          currency: "NGN",
          exchangeRates: {
            USD: 0.00067,
            EUR: 0.00062,
            GBP: 0.00053,
            GHS: 0.008,
            JPY: 0.1,
          },
          lastRateUpdate: null,
        };
  }
  return {
    items: [],
    voucherDiscount: 0,
    currency: "NGN",
    exchangeRates: {},
    lastRateUpdate: null,
  };
};

const saveToLocalStorage = (state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartState",
      JSON.stringify({
        items: state.items,
        voucherDiscount: state.voucherDiscount,
        currency: state.currency,
        exchangeRates: state.exchangeRates,
        lastRateUpdate: state.lastRateUpdate,
      })
    );
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadInitialState(),
  reducers: {
    addToCart: (state, action) => {
      if (!action.payload?.product) {
        console.error("Invalid addToCart payload:", action.payload);
        return;
      }

      const { product, quantity = 1 } = action.payload;

      if (!product.id || typeof product.price === "undefined") {
        console.error("Invalid product data:", product);
        return;
      }

      const existingIndex = state.items.findIndex(
        (item) => item.product?.id === product.id
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          product: {
            ...product,
            freeDelivery: product.freeDelivery || false,
            baseCurrency: product.currency || "NGN",
            basePrice: product.price,
            discount_percentage: product.discount_percentage || 0,
            stock_quantity: product.stock_quantity || 0,
          },
          quantity,
        });
      }

      saveToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product?.id !== action.payload
      );
      saveToLocalStorage(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.product?.id === id);
      if (item) {
        item.quantity = quantity;
        saveToLocalStorage(state);
      }
    },

    applyVoucher: (state, action) => {
      state.voucherDiscount = action.payload.discount || 0;
      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.voucherDiscount = 0;
      saveToLocalStorage(state);
    },

    setCurrency: (state, action) => {
      state.currency = action.payload || "NGN";
      saveToLocalStorage(state);
    },

    updateExchangeRates: (state, action) => {
      state.exchangeRates = action.payload.rates || {};
      state.lastRateUpdate = new Date().toISOString();
      saveToLocalStorage(state);
    },
  },
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartCurrency = (state) => state.cart.currency;
export const selectVoucherDiscount = (state) => state.cart.voucherDiscount;
export const selectExchangeRates = (state) => state.cart.exchangeRates;

export const selectSubtotal = (state) => {
  return state.cart.items.reduce((sum, item) => {
    const rate = state.cart.exchangeRates[state.cart.currency] || 1;
    const convertedPrice = item.product.basePrice * rate;
    return sum + convertedPrice * item.quantity;
  }, 0);
};

export const selectDeliveryFee = (state) => {
  const hasFreeDelivery = state.cart.items.some(
    (item) => item.product.freeDelivery
  );
  if (hasFreeDelivery) return 0;

  const baseDeliveryFee = 2000;
  const rate = state.cart.exchangeRates[state.cart.currency] || 1;
  return baseDeliveryFee * rate;
};

export const selectTotal = (state) => {
  const subtotal = selectSubtotal(state);
  const delivery = selectDeliveryFee(state);
  const discount = state.cart.voucherDiscount;
  return subtotal - discount + delivery;
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyVoucher,
  clearCart,
  setCurrency,
  updateExchangeRates,
} = cartSlice.actions;

export default cartSlice.reducer;
