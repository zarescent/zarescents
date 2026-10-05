"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";

export function ProductShelf({
  eyebrow,
  title,
  emptyHint,
  products,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  emptyHint?: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <section className="section-pad">
      <div className="container-zare px-5 md:px-8">
        <FadeIn className="text-center mb-10 md:mb-12">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
            {eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
            {title}
          </h2>
          <div className="gold-rule mx-auto mt-6 w-24" />
        </FadeIn>

        {products.length === 0 ? (
          <p className="text-center text-muted py-12 text-sm">
            {emptyHint ||
              "Products will appear here once the catalog is connected."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8">
            {products.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 md:mt-12 text-center">
          <Link href={viewAllHref} className="btn-outline">
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
