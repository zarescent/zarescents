"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/types";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, shipping, total } = useCart();
  const sub = subtotal();
  const ship = shipping();
  const tot = total();

  if (items.length === 0) {
    return (
      <div className="pt-32 md:pt-36 section-pad text-center px-5">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-cream">
          Your Bag is Empty
        </h1>
        <p className="mt-3 text-muted">Discover a scent that becomes yours.</p>
        <Link href="/shop" className="btn-gold mt-8 inline-flex">
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 md:pt-36 section-pad !pt-32 md:!pt-36">
      <div className="container-zare px-5 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream text-center mb-12">
          Your Bag
        </h1>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 border-b border-[var(--border)] pb-6"
              >
                <div className="relative h-28 w-24 shrink-0 bg-bg-soft overflow-hidden">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-[family-name:var(--font-display)] text-xl text-cream hover:text-gold-bright"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted mt-1">{item.volume}</p>
                    </div>
                    <p className="text-gold-bright whitespace-nowrap">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-[var(--border)]">
                      <button
                        type="button"
                        className="p-2 text-muted hover:text-cream"
                        onClick={() =>
                          updateQty(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-2 text-muted hover:text-cream"
                        onClick={() =>
                          updateQty(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-muted hover:text-danger"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="border border-[var(--border)] p-6 h-fit bg-[#0c0b0a]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-cream">{formatPKR(sub)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="text-cream">
                  {ship === 0 ? "Free" : formatPKR(ship)}
                </span>
              </div>
              {ship > 0 && (
                <p className="text-xs text-muted">
                  Free shipping on orders {formatPKR(FREE_SHIPPING_THRESHOLD)}+
                </p>
              )}
              <div className="gold-rule" />
              <div className="flex justify-between text-base">
                <span>Total</span>
                <span className="text-gold-bright font-medium">
                  {formatPKR(tot)}
                </span>
              </div>
            </div>
            <Link href="/checkout" className="btn-gold w-full mt-6">
              Checkout · COD
            </Link>
            <Link
              href="/shop"
              className="mt-4 block text-center text-xs uppercase tracking-[0.15em] text-muted hover:text-cream"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
