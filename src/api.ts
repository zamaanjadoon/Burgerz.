import type { Product, Promotion, Review, Order } from './types';

const API_BASE = '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/api/products');
}

export async function fetchPromotions(): Promise<Promotion[]> {
  return apiFetch<Promotion[]>('/api/promotions');
}

export async function fetchReviews(): Promise<Review[]> {
  return apiFetch<Review[]>('/api/reviews');
}

// For now we only use unauthenticated order creation as the UI already provides customer fields.
// If you later add login, we can attach Authorization header and switch to order history.
export async function createOrder(payload: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Order['items'];
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: Order['paymentMethod'];
  status?: Order['status'];
  notes?: string;
}): Promise<{ ok: true; order: Order & { customerId?: string } }> {
  return apiFetch<{ ok: true; order: Order & { customerId?: string } }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Public tracking endpoint is authMiddleware-protected on backend right now.
// So for "live" tracking we will fetch orders from localStorage AND backend orders when available.
// We still keep this function for future once backend is relaxed or auth is added to the UI.
export async function lookupOrderByTrack(track: string, authToken?: string): Promise<Order | null> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  // Backend currently protects /api/orders/lookup with authMiddleware.
  return apiFetch<Order | null>(`/api/orders/lookup/${encodeURIComponent(track)}`, {
    method: 'GET',
    headers,
  });
}

export async function fetchOrders(authToken?: string): Promise<Order[]> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  return apiFetch<Order[]>('/api/orders', {
    method: 'GET',
    headers,
  });
}

export async function createReview(payload: Omit<Review, 'id' | 'date'>): Promise<Review> {
  return apiFetch<Review>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


