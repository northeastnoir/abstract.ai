import { useEffect, useState } from 'react';
import { Product } from '../lib/database';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const fetchedProducts = await response.json();
        
        if (fetchedProducts.length === 0) {
          await fetch('/api/generate-products', { method: 'POST' });
          const newResponse = await fetch('/api/products');
          if (!newResponse.ok) throw new Error('Failed to fetch new products');
          setProducts(await newResponse.json());
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI-Generated Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="font-semibold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
