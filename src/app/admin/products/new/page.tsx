import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New Product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");

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
          New product
        </h1>
      </div>
      <ProductForm />
    </div>
  );
}
