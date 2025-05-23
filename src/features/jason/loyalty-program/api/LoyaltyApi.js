// features/jason/loyalty-program/api/loyaltyApi.js
import { supabase } from "@/lib/supabase";

export const fetchLoyaltyStatus = async (userId) => {
  return supabase
    .from("jason_profiles")
    .select("loyalty_points, loyalty_tier")
    .eq("user_id", userId)
    .single();
};

export const claimReward = async (userId, rewardId) => {
  return supabase
    .from("jason_loyalty_rewards")
    .update({ claimed: true })
    .eq("id", rewardId)
    .eq("user_id", userId);
};
