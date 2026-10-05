export type ProductCategory = "him" | "her" | "unisex" | "testers";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  category: ProductCategory;
  volume: string;
  scent_notes: string[];
  stock: number;
  image_url: string | null;
  image_urls?: string[] | null;
  featured: boolean;
  new_arrival?: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  volume: string;
  quantity: number;
}

export interface Order {
  id: string;
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
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  him: "For Him",
  her: "For Her",
  unisex: "Unisex",
  testers: "Testers",
};

export const FREE_SHIPPING_THRESHOLD = 3999;
export const SHIPPING_FEE = 199;

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
