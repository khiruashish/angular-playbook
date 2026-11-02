import { MenuItem, Order, Restaurant, User } from '../models/models';

export const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Spice Route', cuisine: ['North Indian', 'Mughlai'], rating: 4.5, deliveryTimeMins: 30, costForTwo: 60000, emoji: '🍛', isOpen: true, isVeg: false },
  { id: 'r2', name: 'Green Leaf', cuisine: ['South Indian'], rating: 4.2, deliveryTimeMins: 25, costForTwo: 30000, emoji: '🥞', isOpen: true, isVeg: true },
  { id: 'r3', name: 'Napoli Express', cuisine: ['Italian', 'Pizza'], rating: 4.0, deliveryTimeMins: 40, costForTwo: 80000, emoji: '🍕', isOpen: true, isVeg: false },
  { id: 'r4', name: 'Dragon Wok', cuisine: ['Chinese', 'Asian'], rating: 3.4, deliveryTimeMins: 35, costForTwo: 50000, emoji: '🥡', isOpen: false, isVeg: false },
  { id: 'r5', name: 'Burger Barn', cuisine: ['American', 'Burgers'], rating: 4.3, deliveryTimeMins: 20, costForTwo: 45000, emoji: '🍔', isOpen: true, isVeg: false },
  { id: 'r6', name: 'Sweet Tooth', cuisine: ['Desserts'], rating: 4.7, deliveryTimeMins: 15, costForTwo: 25000, emoji: '🍨', isOpen: true, isVeg: true },
];

export const MOCK_MENU: MenuItem[] = [
  { id: 'm1', restaurantId: 'r1', name: 'Butter Chicken', description: 'Creamy tomato gravy, tandoori chicken', price: 32000, isVeg: false, category: 'Mains', bestseller: true },
  { id: 'm2', restaurantId: 'r1', name: 'Paneer Tikka', description: 'Char-grilled cottage cheese', price: 26000, isVeg: true, category: 'Starters' },
  { id: 'm3', restaurantId: 'r1', name: 'Garlic Naan', description: 'Tandoor baked', price: 6000, isVeg: true, category: 'Breads' },
  { id: 'm4', restaurantId: 'r1', name: 'Dal Makhani', description: 'Slow-cooked black lentils', price: 22000, isVeg: true, category: 'Mains', bestseller: true },
  { id: 'm5', restaurantId: 'r2', name: 'Masala Dosa', description: 'Crispy crepe, potato masala', price: 12000, isVeg: true, category: 'Dosa', bestseller: true },
  { id: 'm6', restaurantId: 'r2', name: 'Idli Sambar', description: 'Steamed rice cakes (2 pcs)', price: 8000, isVeg: true, category: 'Breakfast' },
  { id: 'm7', restaurantId: 'r3', name: 'Margherita', description: 'San Marzano, mozzarella, basil', price: 34900, isVeg: true, category: 'Pizza', bestseller: true },
  { id: 'm8', restaurantId: 'r3', name: 'Pepperoni', description: 'Spicy pepperoni, mozzarella', price: 44900, isVeg: false, category: 'Pizza' },
  { id: 'm9', restaurantId: 'r5', name: 'Classic Smash', description: 'Double patty, cheddar', price: 24900, isVeg: false, category: 'Burgers', bestseller: true },
  { id: 'm10', restaurantId: 'r5', name: 'Fries', description: 'Sea salt', price: 9900, isVeg: true, category: 'Sides' },
  { id: 'm11', restaurantId: 'r6', name: 'Gulab Jamun', description: '2 pcs, warm', price: 9000, isVeg: true, category: 'Indian Sweets' },
  { id: 'm12', restaurantId: 'r4', name: 'Hakka Noodles', description: 'Wok tossed', price: 18000, isVeg: true, category: 'Noodles' },
];

export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'customer@food.dev': { password: 'password', user: { id: 'u1', name: 'Asha Customer', email: 'customer@food.dev', roles: ['CUSTOMER'] } },
  'admin@food.dev': { password: 'password', user: { id: 'u2', name: 'Ravi Admin', email: 'admin@food.dev', roles: ['CUSTOMER', 'ADMIN'] } },
};

export const MOCK_ORDERS: Order[] = [];
