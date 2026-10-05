import type { OrderStatus } from "@/lib/types";

export interface TrackedOrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface TrackedOrder {
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  status: OrderStatus;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
  items: TrackedOrderItem[];
}

export type SavedOrderRef = {
  orderNumber: string;
  email: string;
  savedAt: string;
};

const STORAGE_KEY = "zare_saved_orders";

export function getSavedOrders(): SavedOrderRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedOrderRef[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrderRef(orderNumber: string, email: string) {
  if (typeof window === "undefined") return;
  const normalized = {
    orderNumber: orderNumber.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
    savedAt: new Date().toISOString(),
  };
  if (!normalized.orderNumber || !normalized.email) return;

  const list = getSavedOrders().filter(
    (o) =>
      o.orderNumber.toUpperCase() !== normalized.orderNumber ||
      o.email.toLowerCase() !== normalized.email
  );
  list.unshift(normalized);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
}

export function removeSavedOrderRef(orderNumber: string, email: string) {
  if (typeof window === "undefined") return;
  const next = getSavedOrders().filter(
    (o) =>
      o.orderNumber.toUpperCase() !== orderNumber.toUpperCase() ||
      o.email.toLowerCase() !== email.toLowerCase()
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
