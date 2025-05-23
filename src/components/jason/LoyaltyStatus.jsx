export default function LoyaltyStatus({ points, level }) {
  const progress = Math.min((points % 1000) / 10, 100); // Example calculation

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-2">Your Loyalty Status</h3>
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold mr-3">
          {level.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{level} Member</p>
          <p className="text-sm text-gray-600">{points} points</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-center">
        {1000 - (points % 1000)} points to next tier
      </p>
    </div>
  );
}
