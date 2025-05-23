import { supabase } from '../lib/supabaseClient';

export const ProductService = {
  getAllProducts: async () => {
    const { data, error } = await supabase
      .from('jason_products')
      .select(`
        *,
        category:category_id (name)
      `);
    
    if (error) throw error;
    return data.map(product => ({
      ...product,
      category_name: product.category?.name || '',
      discount_price: product.discount_price || null,
      freeDelivery: product.free_delivery || false,
      currency: product.currency || 'NGN',
      rating: product.rating || 0,
      review_count: product.review_count || 0,
      cloudinary_urls: product.cloudinary_urls || [],
      specifications: product.specifications || {}
    }));
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('jason_products')
      .select(`
        *,
        category:category_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      category_name: data.category?.name || '',
      discount_price: data.discount_price || null,
      freeDelivery: data.free_delivery || false,
      currency: data.currency || 'NGN',
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      cloudinary_urls: data.cloudinary_urls || [],
      specifications: data.specifications || {}
    };
  },

  getFeaturedProducts: async () => {
    const { data, error } = await supabase
      .from('jason_products')
      .select(`
        *,
        category:category_id (name)
      `)
      .eq('featured', true)
      .limit(4);
    
    if (error) throw error;
    return data.map(product => ({
      ...product,
      category_name: product.category?.name || '',
      discount_price: product.discount_price || null,
      freeDelivery: product.free_delivery || false,
      currency: product.currency || 'NGN',
      rating: product.rating || 0,
      review_count: product.review_count || 0,
      cloudinary_urls: product.cloudinary_urls || [],
      specifications: product.specifications || {}
    }));
  }
};