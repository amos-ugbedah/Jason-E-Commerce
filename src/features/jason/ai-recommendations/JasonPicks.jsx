import { useEffect } from 'react';
import { useJasonPicks } from './useJasonPicks';
import ProductCard from '@/components/jason/ProductCard';

export default function JasonPicks({ userId }) {
  const { picks, loading, error } = useJasonPicks(userId);

  // Example of using useEffect
  useEffect(() => {
    if (error) {
      console.error('Error fetching Jason\'s Picks:', error);
    }
  }, [error]); // Runs when `error` changes

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-blue-600 mr-2">🤖</span>
        Jason's Picks Just For You
      </h2>

      {loading ? (
        <div>Loading recommendations...</div>
      ) : error ? (
        <div className="text-red-600">Error fetching recommendations. Please try again later.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {picks.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
