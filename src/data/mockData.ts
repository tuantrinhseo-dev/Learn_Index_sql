import { User, Product, Order } from './types';

// Generate 1000 Users
const cities = ['New York', 'London', 'Tokyo', 'Berlin', 'Paris', 'Hanoi', 'Sydney', 'Toronto'];
const countries = ['USA', 'UK', 'Japan', 'Germany', 'France', 'Vietnam', 'Australia', 'Canada'];
const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys', 'Sports'];

export const mockUsers: User[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  username: `user_${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: Math.floor(Math.random() * 50) + 18,
  city: cities[i % cities.length],
  country: countries[i % countries.length],
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

// Generate 500 Products
export const mockProducts: Product[] = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: categories[i % categories.length],
  price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
  stock: Math.floor(Math.random() * 100),
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
}));

// Generate 2000 Orders
export const mockOrders: Order[] = Array.from({ length: 2000 }, (_, i) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
  const quantity = Math.floor(Math.random() * 5) + 1;
  return {
    id: i + 1,
    user_id: user.id,
    product_id: product.id,
    quantity,
    total_price: parseFloat((product.price * quantity).toFixed(2)),
    status: ['pending', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as any,
    order_date: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
  };
});
