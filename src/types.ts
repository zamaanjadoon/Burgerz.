export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'burgers' | 'fries' | 'wraps' | 'wings' | 'sandwiches' | 'drinks';
  description: string;
  image: string;
  rating: number;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  tag?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Cooking' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Cash on Delivery' | 'Easypaisa' | 'JazzCash';
  placedAt: string;
  notes?: string;
  trackCode: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  bgImage: string;
  code?: string;
}
