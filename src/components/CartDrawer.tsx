"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/types";

export function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    drawerOpen,
    closeDrawer,
    updateQty,
    removeItem,
    subtotal,
    shipping,
    total,
  } = useCart();

  const sub = subtotal();
  const ship = shipping();
  const tot = total();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (!drawerOpen || isAdmin) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer, isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-[10040] bg-black/60 transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed inset-y-0 right-0 z-[10050] flex w-full max-w-md flex-col bg-[#0c0b0a] border-l border-[var(--border)] shadow-[-20px_0_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 md:px-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">
              Your Bag
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl text-cream">
              {count === 0
                ? "Empty"
                : `${count} ${count === 1 ? "item" : "items"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="flex h-10 w-10 items-center justify-center text-muted hover:text-cream transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl text-cream">
              Your bag is empty
            </p>
            <p className="mt-2 text-sm text-muted">
              Discover a scent that becomes yours.
            </p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="btn-gold mt-8 inline-flex"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 md:px-6 py-4 space-y-5">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-[var(--border)] pb-5"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-24 w-20 shrink-0 bg-bg-soft overflow-hidden"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-[family-name:var(--font-display)] text-lg text-cream hover:text-gold-bright line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted mt-0.5">
                          {item.volume}
                        </p>
                      </div>
                      <p className="text-sm text-gold-bright whitespace-nowrap">
                        {formatPKR(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-[var(--border)]">
                        <button
                          type="button"
                          className="p-2 text-muted hover:text-cream"
                          onClick={() =>
                            updateQty(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 text-muted hover:text-cream"
                          onClick={() =>
                            updateQty(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-muted hover:text-danger"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--border)] px-5 md:px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-cream">{formatPKR(sub)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="text-cream">
                  {ship === 0 ? "Free" : formatPKR(ship)}
                </span>
              </div>
              {ship > 0 ? (
                <p className="text-xs text-muted">
                  Free shipping on orders {formatPKR(FREE_SHIPPING_THRESHOLD)}+
                </p>
              ) : null}
              <div className="gold-rule" />
              <div className="flex justify-between text-base">
                <span>Total</span>
                <span className="text-gold-bright font-medium">
                  {formatPKR(tot)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="btn-gold w-full mt-2"
              >
                Checkout · COD
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-2 text-center text-xs uppercase tracking-[0.15em] text-muted hover:text-cream transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
