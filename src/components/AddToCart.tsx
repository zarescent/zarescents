"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";

export function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const maxQty = Math.max(0, product.stock);

  const handleAdd = () => {
    if (maxQty < 1) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        imageUrl: product.image_url,
        volume: product.volume,
      },
      Math.min(qty, maxQty)
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[var(--border)]">
          <button
            type="button"
            className="p-3 text-muted hover:text-cream"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease"
            disabled={maxQty < 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            type="button"
            className="p-3 text-muted hover:text-cream"
            onClick={() =>
              setQty((q) => Math.min(Math.max(maxQty, 1), q + 1))
            }
            aria-label="Increase"
            disabled={maxQty < 1}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-sm text-muted">
          {maxQty > 0 ? `${maxQty} in stock` : "Out of stock"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="btn-gold flex-1"
          disabled={product.stock < 1}
          onClick={handleAdd}
        >
          <ShoppingBag size={16} />
          {added ? "Added" : "Add to Bag"}
        </button>
        <button
          type="button"
          className="btn-outline flex-1"
          disabled={product.stock < 1}
          onClick={() => {
            handleAdd();
            router.push("/checkout");
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
