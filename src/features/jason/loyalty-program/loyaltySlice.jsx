import { createSlice } from "@reduxjs/toolkit";
import { fetchLoyaltyStatus, fetchAvailableRewards } from "./api/LoyaltyApi";

const loyaltySlice = createSlice({
  name: "loyalty",
  initialState: {
    points: 0,
    tier: "bronze",
    rewards: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchLoyaltyStatus actions
      .addCase(fetchLoyaltyStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoyaltyStatus.fulfilled, (state, action) => {
        state.points = action.payload.loyalty_points;
        state.tier = action.payload.loyalty_tier;
        state.status = "succeeded";
      })

      // Handle fetchAvailableRewards actions
      .addCase(fetchAvailableRewards.pending, (state) => {
        state.status = "loading_rewards";
      })
      .addCase(fetchAvailableRewards.fulfilled, (state, action) => {
        state.rewards = action.payload.rewards;
        state.status = "rewards_succeeded";
      })
      .addCase(fetchAvailableRewards.rejected, (state) => {
        state.status = "rewards_failed";
      });
  },
});

export default loyaltySlice.reducer;
