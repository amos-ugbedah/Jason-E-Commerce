import { supabase } from '@/lib/supabase';

export const fetchJasonsPicks = async (userId) => {
  // 1. Get user preferences
  const { data: preferences, error: prefError } = await supabase
    .from('jason_profiles')
    .select('preferences')
    .eq('user_id', userId)
    .single();

  if (prefError) {
    console.error("Error fetching user preferences:", prefError);
    return [];
  }

  // 2. Get recommended products (filter based on preferences if available)
  const filters = preferences?.product_categories || []; // Example: preferences.product_categories might be an array
  const query = supabase
    .from('jason_products')
    .select(`
      id, 
      name,
      price,
      cloudinary_urls,
      rating
    `)
    .order('rating', { ascending: false })
    .limit(4);

  if (filters.length > 0) {
    query.in('category_id', filters); // Assuming category_id matches user preferences
  }

  const { data: products, error: prodError } = await query;

  if (prodError) {
    console.error("Error fetching recommended products:", prodError);
    return [];
  }

  return products;
};
