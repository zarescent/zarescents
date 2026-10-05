import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Zaré Scents collection: luxury fragrances for him, her, and unisex.",
};

const categories: Array<ProductCategory | "all"> = [
  "all",
  "him",
  "her",
  "unisex",
  "testers",
];

const collections = [
  { key: "all", label: "All", href: "/shop" },
  { key: "new", label: "New Arrivals", href: "/shop?collection=new" },
  { key: "popular", label: "Bestsellers", href: "/shop?collection=popular" },
] as const;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string }>;
}) {
  const { category: rawCat, collection: rawCol } = await searchParams;
  const category =
    rawCat && ["him", "her", "unisex", "testers"].includes(rawCat)
      ? (rawCat as ProductCategory)
      : undefined;
  const collection =
    rawCol === "new" || rawCol === "popular" ? rawCol : undefined;

  const products = await getProducts({
    category,
    collection,
  });

  const heading = collection
    ? collection === "new"
      ? "New Arrivals"
      : "Bestsellers"
    : category
      ? CATEGORY_LABELS[category]
      : "All Fragrances";

  return (
    <div className="pt-32 md:pt-36 section-pad !pt-32 md:!pt-36">
      <div className="container-zare px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
            Collection
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-cream">
            {heading}
          </h1>
          <div className="gold-rule mx-auto mt-6 w-20" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {collections.map((c) => {
            const active =
              (c.key === "all" && !collection) || c.key === collection;
            return (
              <Link
                key={c.key}
                href={c.href}
                className={`px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] border transition-colors ${
                  active
                    ? "border-gold text-gold-bright bg-gold/10"
                    : "border-[var(--border)] text-muted hover:text-cream"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => {
            const href =
              c === "all"
                ? collection
                  ? `/shop?collection=${collection}`
                  : "/shop"
                : collection
                  ? `/shop?category=${c}&collection=${collection}`
                  : `/shop?category=${c}`;
            const active = (c === "all" && !category) || c === category;
            return (
              <Link
                key={c}
                href={href}
                className={`px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] border transition-colors ${
                  active
                    ? "border-gold text-gold-bright bg-gold/10"
                    : "border-[var(--border)] text-muted hover:text-cream"
                }`}
              >
                {c === "all" ? "All Scents" : CATEGORY_LABELS[c]}
              </Link>
            );
          })}
        </div>

        {products.length === 0 ? (
          <p className="text-center text-muted py-20">
            No products yet. Run{" "}
            <code className="text-gold">supabase/schema.sql</code> in the
            Supabase SQL Editor to seed the catalog.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
