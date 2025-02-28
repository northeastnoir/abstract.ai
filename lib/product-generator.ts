import OpenAI from 'openai';
import { Product } from './database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categories = [
  "Digital Art",
  "E-books",
  "Software Tools",
  "Online Courses",
  "Stock Photos",
  "Music Tracks"
];

async function generateProductIdea(): Promise<Partial<Product>> {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a creative AI assistant that generates detailed digital product ideas.",
      },
      {
        role: "user",
        content: "Generate a new digital product idea. Include name, description, features, target audience, and suggested price.",
      },
    ],
  });

  const productIdea = JSON.parse(completion.choices[0].message.content || "{}");
  
  return {
    name: productIdea.name,
    description: productIdea.description,
    features: productIdea.features,
    targetAudience: productIdea.targetAudience,
    price: productIdea.suggestedPrice,
    category: categories[Math.floor(Math.random() * categories.length)],
    imageUrl: `/placeholder.svg?text=${encodeURIComponent(productIdea.name)}&width=300&height=300`,
  };
}

export async function generateProducts(count: number): Promise<Partial<Product>[]> {
  const products: Partial<Product>[] = [];

  for (let i = 0; i < count; i++) {
    const product = await generateProductIdea();
    products.push(product);
  }

  return products;
}
