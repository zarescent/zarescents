import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory, Order } from "@/lib/types";

export async function getProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
  collection?: "new" | "popular";
  limit?: number;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("active", true);

  if (options?.category) query = query.eq("category", options.category);
  if (options?.featured || options?.collection === "popular") {
    query = query.eq("featured", true);
  }

  if (options?.collection === "new") {
    query = query.order("created_at", { ascending: false });
  } else if (options?.collection === "popular") {
    query = query.order("sort_order", { ascending: true });
  } else {
    query = query.order("sort_order", { ascending: true });
  }

  // Fetch extra for "new" so we can prefer flagged new_arrival rows in JS
  // (avoids SQL error when the column is not migrated yet)
  if (options?.limit) {
    query = query.limit(
      options.collection === "new" ? Math.max(options.limit * 3, 24) : options.limit
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }

  let products = (data ?? []) as Product[];

  if (options?.collection === "new") {
    const flagged = products.filter((p) => p.new_arrival === true);
    products = flagged.length > 0 ? flagged : products;
  }

  // If popular filter returns too few, fill from catalog
  if (options?.collection === "popular" && products.length < (options.limit || 6)) {
    const ids = new Set(products.map((p) => p.id));
    const more = await getProducts({ limit: 12 });
    for (const p of more) {
      if (ids.has(p.id)) continue;
      products.push(p);
      if (products.length >= (options.limit || 6)) break;
    }
  }

  if (options?.limit) products = products.slice(0, options.limit);
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug:", error.message);
    return null;
  }
  return data as Product | null;
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAdminProducts:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders:", error.message);
    return [];
  }
  return (data ?? []) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getOrderById:", error.message);
    return null;
  }
  return data as Order | null;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return !!data;
}
