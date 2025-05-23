// /utils/updateStock.js
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export const updateProductStock = async (productId, quantity = 1) => {
  try {
    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from("jason_products")
      .select("stock_quantity")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      throw new Error("Product not found.");
    }

    // Check if enough stock
    if (product.stock_quantity < quantity) {
      toast.error("Not enough stock.");
      return false;
    }

    // Reduce stock
    const newStock = product.stock_quantity - quantity;

    const { error: updateError } = await supabase
      .from("jason_products")
      .update({ stock_quantity: newStock })
      .eq("id", productId);

    if (updateError) {
      throw new Error("Failed to update stock.");
    }

    return true;
  } catch (error) {
    console.error("Stock update error:", error.message);
    toast.error(error.message || "Stock update failed.");
    return false;
  }
};
