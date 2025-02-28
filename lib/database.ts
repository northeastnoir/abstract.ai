import { kv } from '@vercel/kv';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  features: string[];
  targetAudience: string;
}

export async function getProducts(): Promise<Product[]> {
  const products = await kv.get<Product[]>('products');
  return products || [];
}

export async function saveProducts(products: Partial<Product>[]): Promise<void> {
  const existingProducts = await getProducts();
  const newProducts = products.map((product, index) => ({
    ...product,
    id: `${existingProducts.length + index + 1}`,
  })) as Product[];
  await kv.set('products', [...existingProducts, ...newProducts]);
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductCount(): Promise<number> {
  const products = await getProducts();
  return products.length;
}

export async function getRecentProducts(count: number): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(-count);
}
