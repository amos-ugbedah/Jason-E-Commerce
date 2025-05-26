// Add these exports if they don't exist
export const fetchLoyaltyStatus = async (userId) => {
  try {
    const response = await fetch(`/api/loyalty/status/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching loyalty status:', error);
    throw error;
  }
};

export const fetchAvailableRewards = async () => {
  try {
    const response = await fetch('/api/loyalty/rewards');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
};