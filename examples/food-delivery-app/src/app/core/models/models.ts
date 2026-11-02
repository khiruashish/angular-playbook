/** Money is always integer minor units (paise) — never floating point. */
export type Paise = number;

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTimeMins: number;
  costForTwo: Paise;
  imageUrl?: string;
  /** Used as a lightweight cover when no image is available. */
  emoji: string;
  isOpen: boolean;
  isVeg: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: Paise;
  isVeg: boolean;
  category: string;
  bestseller?: boolean;
}

export interface CartLine {
  item: MenuItem;
  qty: number;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Address {
  line1: string;
  city: string;
  pincode: string;
}

export interface PlaceOrderRequest {
  restaurantId: string;
  lines: { menuItemId: string; qty: number }[];
  address: Address;
  paymentMethod: 'UPI' | 'CARD' | 'COD';
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  total: Paise;
  status: OrderStatus;
  placedAt: string;
  etaMins: number;
}

export type Role = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}
