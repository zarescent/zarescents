import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const product = data as Product;

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-[0.65rem] uppercase tracking-[0.15em] text-muted hover:text-cream"
      >
        ← Products
      </Link>
      <div className="mt-4 mb-8">
        <p className="admin-section-label">Catalog</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
          Edit product
        </h1>
        <p className="mt-1 text-sm text-muted">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
