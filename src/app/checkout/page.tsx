"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { formatPKR, FREE_SHIPPING_THRESHOLD } from "@/lib/types";

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Other",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sub = subtotal();
  const ship = shipping();
  const tot = total();

  if (items.length === 0 && !loading) {
    return (
      <div className="pt-32 md:pt-36 section-pad text-center px-5">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-cream">
          Nothing to Checkout
        </h1>
        <Link href="/shop" className="btn-gold mt-8 inline-flex">
          Shop Collection
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      p_customer_name: String(form.get("name") || "").trim(),
      p_email: String(form.get("email") || "").trim(),
      p_phone: String(form.get("phone") || "").trim(),
      p_city: String(form.get("city") || "").trim(),
      p_address: String(form.get("address") || "").trim(),
      p_notes: String(form.get("notes") || "").trim(),
      p_items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("place_order", payload);

      if (rpcError) throw new Error(rpcError.message);

      const orderNumber =
        (data as { order_number?: string })?.order_number || "ZR-ORDER";
      const orderEmail = String(form.get("email") || "").trim();
      clear();
      router.push(
        `/order-success?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(orderEmail)}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not place order. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 md:pt-36 section-pad !pt-32 md:!pt-36">
      <div className="container-zare px-5 md:px-8 max-w-5xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream text-center mb-3">
          Checkout
        </h1>
        <p className="text-center text-muted text-sm mb-12">
          Cash on Delivery · Pay when your order arrives
        </p>

        <form
          onSubmit={onSubmit}
          className="grid lg:grid-cols-[1fr_320px] gap-10"
        >
          <div className="space-y-5">
            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">
              Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs text-muted">Full Name *</span>
                <input
                  name="name"
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="you@email.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted">Phone *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9+\-\s]{10,15}"
                  className="input-field"
                  placeholder="03XX XXXXXXX"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted">City *</span>
                <select name="city" required className="input-field" defaultValue="">
                  <option value="" disabled>
                    Select city
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs text-muted">
                  Full Address *
                </span>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="input-field resize-none"
                  placeholder="House / street / area"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs text-muted">
                  Order Notes (optional)
                </span>
                <textarea
                  name="notes"
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Any special instructions"
                />
              </label>
            </div>

            {error && (
              <p className="text-sm text-danger border border-danger/30 bg-danger/10 px-4 py-3">
                {error}
              </p>
            )}
          </div>

          <aside className="border border-[var(--border)] p-6 h-fit bg-[#0c0b0a]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold mb-4">
              Summary
            </h2>
            <ul className="space-y-3 text-sm mb-4">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-2 text-muted">
                  <span className="text-cream/90">
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatPKR(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="gold-rule mb-4" />
            <div className="space-y-2 text-sm">
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
                  Free shipping {formatPKR(FREE_SHIPPING_THRESHOLD)}+
                </p>
              )}
              <div className="flex justify-between pt-2 text-base">
                <span>Total</span>
                <span className="text-gold-bright">{formatPKR(tot)}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted">
              Payment method: <span className="text-cream">Cash on Delivery</span>
            </p>
            <button type="submit" className="btn-gold w-full mt-6" disabled={loading}>
              {loading ? "Placing Order…" : "Place Order"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
