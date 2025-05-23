export class Product {
  constructor({ 
    id, 
    name, 
    description, 
    price, 
    discount_price,
    free_delivery,
    currency,
    rating,
    review_count,
    cloudinary_urls,
    specifications,
    featured, 
    image_url,
    category_id,
    created_at,
    categories
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.discountPrice = discount_price;
    this.freeDelivery = free_delivery;
    this.currency = currency || 'USD';
    this.rating = rating || 0;
    this.reviewCount = review_count || 0;
    this.cloudinary_urls = cloudinary_urls || [];
    this.specifications = specifications || {};
    this.featured = featured;
    this.imageUrl = image_url;
    this.categoryId = category_id;  // Now properly stored
    this.category = categories?.name || '';
    this.createdAt = new Date(created_at);
  }

  get formattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  get formattedDiscountPrice() {
    return `$${this.discountPrice.toFixed(2)}`;
  }

  get discountPercentage() {
    if (!this.discountPrice) return 0;
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }

  get isNew() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.createdAt > weekAgo;
  }

  // New method to get category information
  getCategoryInfo() {
    return {
      id: this.categoryId,
      name: this.category
    };
  }
}