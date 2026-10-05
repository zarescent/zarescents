import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getAdminProducts, isCurrentUserAdmin } from "@/lib/products";
import { formatPKR, CATEGORY_LABELS } from "@/lib/types";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="admin-section-label">Catalog</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} item{products.length === 1 ? "" : "s"} in catalog
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold !min-h-0 !py-2.5 !px-4">
          <Plus size={15} strokeWidth={2} />
          Add product
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table min-w-[780px]">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Placement</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const thumb =
                p.image_url ||
                (p.image_urls && p.image_urls[0]) ||
                null;
              return (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden border border-[var(--border)] bg-[#12100e]">
                        {thumb && (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-cream font-medium">{p.name}</p>
                        <p className="text-xs text-muted">{p.volume}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{CATEGORY_LABELS[p.category]}</td>
                  <td>{formatPKR(Number(p.price))}</td>
                  <td>
                    <span
                      className={
                        p.stock <= 5 ? "text-amber-200" : "text-cream/80"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <span className="admin-chip is-gold">Featured</span>
                      )}
                      {p.new_arrival && (
                        <span className="admin-chip is-gold">New</span>
                      )}
                      {!p.featured && !p.new_arrival && (
                        <span className="admin-chip">Standard</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        p.active
                          ? "text-success text-xs uppercase tracking-wider"
                          : "text-muted text-xs uppercase tracking-wider"
                      }
                    >
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-gold-bright hover:underline text-xs uppercase tracking-wider"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="!py-10 text-center text-muted">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-gold-bright hover:underline">
                    Add your first
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
