"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageSearch, X } from "lucide-react";
import {
  getSavedOrders,
  saveOrderRef,
  type TrackedOrder,
} from "@/lib/order-tracking";
import { fetchTrackedOrder } from "@/lib/track-order-client";
import { OrderTrackingDetails } from "@/components/OrderTrackingDetails";

type Tab = "track" | "my-orders";

export function TrackOrderFloat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("track");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setSavedCount(getSavedOrders().length);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  async function onTrack(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const order = await fetchTrackedOrder(orderNumber, email);
      saveOrderRef(order.order_number, order.email);
      setSavedCount(getSavedOrders().length);
      setResult(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find order");
    } finally {
      setLoading(false);
    }
  }

  function openPanel(nextTab: Tab = "track") {
    setTab(nextTab);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => openPanel("track")}
        aria-label="Track your order"
        className="track-float"
      >
        <span className="track-float__label">Track order</span>
        <span className="track-float__icon">
          <PackageSearch size={24} strokeWidth={1.5} />
        </span>
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[10030] bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Track order"
        className={`fixed inset-y-0 right-0 z-[10035] flex w-full max-w-md flex-col bg-[#0c0b0a] border-l border-[var(--border)] shadow-[-20px_0_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">
              Order tracking
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl text-cream">
              Track & profile
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted hover:text-cream p-1"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex border-b border-[var(--border)]">
          {(
            [
              ["track", "Track order"],
              ["my-orders", `My orders${savedCount ? ` (${savedCount})` : ""}`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 py-3 text-[0.65rem] uppercase tracking-[0.15em] transition-colors ${
                tab === id
                  ? "text-gold-bright border-b-2 border-gold"
                  : "text-muted hover:text-cream"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {tab === "track" ? (
            <div className="space-y-6">
              <p className="text-sm text-muted leading-relaxed">
                Enter the order number from your confirmation and the email you
                used at checkout.
              </p>
              <form onSubmit={onTrack} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs text-muted">
                    Order number
                  </span>
                  <input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    placeholder="ZR-251005-ABC123"
                    className="input-field uppercase tracking-wider"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-muted">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    autoComplete="email"
                  />
                </label>
                {error && (
                  <p className="text-sm text-danger border border-danger/30 bg-danger/10 px-3 py-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-gold w-full"
                  disabled={loading}
                >
                  {loading ? "Looking up…" : "Track order"}
                </button>
              </form>
              {result && <OrderTrackingDetails order={result} compact />}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Orders you&apos;ve placed or tracked on this device appear in
                your profile.
              </p>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="btn-outline w-full !min-h-0 !py-3"
              >
                Open My Profile
              </Link>
              {savedCount === 0 ? (
                <p className="text-sm text-muted text-center py-8 border border-dashed border-[var(--border)]">
                  No saved orders yet. Track an order or complete checkout.
                </p>
              ) : (
                <ul className="space-y-2">
                  {getSavedOrders().slice(0, 5).map((ref) => (
                    <li
                      key={`${ref.orderNumber}-${ref.email}`}
                      className="border border-[var(--border)] px-4 py-3 text-sm"
                    >
                      <p className="text-gold-bright tracking-wide">
                        {ref.orderNumber}
                      </p>
                      <p className="text-xs text-muted mt-1">{ref.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
