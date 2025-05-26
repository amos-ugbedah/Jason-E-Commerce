import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchLoyaltyStatus, 
  fetchAvailableRewards 
} from './api/LoyaltyApi';

// Add this export
export const fetchLoyaltyData = createAsyncThunk(
  'loyalty/fetchData',
  async (userId, { rejectWithValue }) => {
    try {
      const [status, rewards] = await Promise.all([
        fetchLoyaltyStatus(userId),
        fetchAvailableRewards()
      ]);
      return { status, rewards };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState: {
    status: null,
    rewards: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoyaltyData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.rewards = action.payload.rewards;
      })
      .addCase(fetchLoyaltyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default loyaltySlice.reducer;