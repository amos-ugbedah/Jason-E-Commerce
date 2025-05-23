import { supabase } from "../../lib/supabaseClient";

// Action Types
export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

// Action Creators
export const fetchAllProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });

  try {
    const { data: products, error } = await supabase
      .from("jason_products")
      .select("*");

    if (error) throw error;

    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: products,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.message,
    });
  }
};
