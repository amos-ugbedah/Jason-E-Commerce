export default function WishlistPreview({ limit }) {
  const items = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      onSale: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      onSale: false,
    },
    {
      id: 3,
      name: "Compact Mirrorless Camera",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      onSale: true,
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
      onSale: false,
    },
  ];

  const displayedItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayedItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition"
        >
          <div className="aspect-square bg-gray-100 relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.onSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
              {item.name}
            </h3>
            <p className="font-bold">
              ${item.price.toFixed(2)}
              {item.onSale && (
                <span className="ml-2 text-sm text-red-500">20% OFF</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
