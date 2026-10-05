"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/types";
import { formatPKR, CATEGORY_LABELS } from "@/lib/types";

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
  }
  return sharedObserver;
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : null;

  return (
    <article
      ref={ref}
      className="reveal-on-scroll"
      style={{ transitionDelay: `${Math.min(index, 6) * 0.05}s` }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0c0b0a]">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          )}
          {/* Flatten photo mid-tones so grids don't show a gray band */}
          <div className="pointer-events-none absolute inset-0 bg-[#0c0b0a]/25" />
          {discount && (
            <span className="absolute left-3 top-3 z-[1] bg-gold px-2 py-1 text-[10px] font-semibold tracking-wider text-[#1a1410]">
              -{discount}%
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            {CATEGORY_LABELS[product.category]} · {product.volume}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-cream group-hover:text-gold-bright transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted line-clamp-1">
            {product.short_description}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-gold-bright">{formatPKR(product.price)}</span>
            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <span className="text-sm text-muted line-through">
                  {formatPKR(product.compare_at_price)}
                </span>
              )}
          </div>
        </div>
      </Link>
    </article>
  );
}
