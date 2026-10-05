"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import {
  getSavedOrders,
  removeSavedOrderRef,
  saveOrderRef,
  type SavedOrderRef,
  type TrackedOrder,
} from "@/lib/order-tracking";
import { fetchTrackedOrder } from "@/lib/track-order-client";
import { OrderTrackingDetails } from "@/components/OrderTrackingDetails";
import { formatPKR } from "@/lib/types";

type LoadedOrder = {
  ref: SavedOrderRef;
  order: TrackedOrder | null;
  error?: string;
};

export function AccountProfile() {
  const [loaded, setLoaded] = useState<LoadedOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [trackNumber, setTrackNumber] = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setRefreshing(true);
    const refs = getSavedOrders();
    const results: LoadedOrder[] = await Promise.all(
      refs.map(async (ref) => {
        try {
          const order = await fetchTrackedOrder(ref.orderNumber, ref.email);
          return { ref, order };
        } catch (err) {
          return {
            ref,
            order: null,
            error: err instanceof Error ? err.message : "Could not load",
          };
        }
      })
    );
    setLoaded(results);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function onAddOrder(e: FormEvent) {
    e.preventDefault();
    setTrackLoading(true);
    setTrackError("");
    try {
      const order = await fetchTrackedOrder(trackNumber, trackEmail);
      saveOrderRef(order.order_number, order.email);
      setTrackNumber("");
      setTrackEmail("");
      setExpanded(order.order_number);
      await loadAll();
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setTrackLoading(false);
    }
  }

  function onRemove(ref: SavedOrderRef) {
    removeSavedOrderRef(ref.orderNumber, ref.email);
    void loadAll();
  }

  const profile = loaded.find((l) => l.order)?.order;

  return (
    <div className="space-y-10">
      <section className="border border-[var(--border)] p-5 md:p-6">
        <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-gold mb-4">
          Profile details
        </h2>
        {profile ? (
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted text-xs uppercase tracking-wider">Name</dt>
              <dd className="text-cream mt-1">{profile.customer_name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wider">Email</dt>
              <dd className="text-cream mt-1">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wider">Phone</dt>
              <dd className="text-cream mt-1">{profile.phone}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wider">City</dt>
              <dd className="text-cream mt-1">{profile.city}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted">
            Track or place an order to see your details here.
          </p>
        )}
      </section>

      <section className="border border-[var(--border)] p-5 md:p-6">
        <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-gold mb-4">
          Add order to profile
        </h2>
        <form onSubmit={onAddOrder} className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-xs text-muted">Order number</span>
            <input
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
              required
              className="input-field uppercase tracking-wider"
              placeholder="ZR-251005-ABC123"
            />
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-xs text-muted">Email</span>
            <input
              type="email"
              value={trackEmail}
              onChange={(e) => setTrackEmail(e.target.value)}
              required
              className="input-field"
            />
          </label>
          {trackError && (
            <p className="sm:col-span-2 text-sm text-danger">{trackError}</p>
          )}
          <button
            type="submit"
            className="btn-gold sm:col-span-2 !min-h-0 !py-3"
            disabled={trackLoading}
          >
            {trackLoading ? "Adding…" : "Save to my orders"}
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            My orders
          </h2>
          <button
            type="button"
            onClick={() => void loadAll()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted hover:text-gold"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
              strokeWidth={1.5}
            />
            Refresh
          </button>
        </div>

        {loaded.length === 0 ? (
          <p className="text-sm text-muted border border-[var(--border)] p-8 text-center">
            No orders saved on this device yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {loaded.map(({ ref, order, error }) => {
              const key = `${ref.orderNumber}-${ref.email}`;
              const isOpen = expanded === ref.orderNumber;
              return (
                <li
                  key={key}
                  className="border border-[var(--border)] overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 p-4 bg-white/[0.02]">
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(isOpen ? null : ref.orderNumber)
                      }
                      className="text-left flex-1"
                    >
                      <p className="text-gold-bright tracking-wide">
                        {ref.orderNumber}
                      </p>
                      {order ? (
                        <p className="mt-1 text-xs text-muted capitalize">
                          {order.status} · {formatPKR(Number(order.total))}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-danger">{error}</p>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(ref)}
                      className="text-muted hover:text-danger p-1"
                      aria-label="Remove from profile"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                  {isOpen && order && (
                    <div className="p-4 border-t border-[var(--border)]">
                      <OrderTrackingDetails order={order} compact />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
