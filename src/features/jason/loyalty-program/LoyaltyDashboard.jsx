import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoyaltyData } from "./loyaltySlice";

export default function LoyaltyDashboard() {
  const dispatch = useDispatch();
  const { points, tier, rewards, status } = useSelector(
    (state) => state.loyalty
  );
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchLoyaltyData(userId));
    }
  }, [userId, dispatch]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Jason Loyalty Club</h2>
        <div className="badge bg-blue-600 text-white px-3 py-1 rounded-full">
          {tier} Tier
        </div>
      </div>

      {/* Points Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Your Points</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${(points % 1000) / 10}%` }}
          ></div>
        </div>
        <p className="text-right mt-1">{points} points</p>
      </div>

      {/* Rewards Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>

        {/* Show loading, error, or rewards */}
        {status === "loading" ? (
          <div className="text-gray-500 text-center">Loading rewards...</div>
        ) : status === "error" ? (
          <div className="text-red-600 text-center">
            Failed to load rewards. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
