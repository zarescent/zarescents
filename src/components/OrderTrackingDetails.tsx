import Link from "next/link";
import { formatPKR, type OrderStatus } from "@/lib/types";
import type { TrackedOrder } from "@/lib/order-tracking";

const statusSteps: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Order placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "text-amber-200 border-amber-500/40 bg-amber-500/10",
  confirmed: "text-sky-200 border-sky-500/40 bg-sky-500/10",
  shipped: "text-violet-200 border-violet-500/40 bg-violet-500/10",
  delivered: "text-emerald-200 border-emerald-500/40 bg-emerald-500/10",
  cancelled: "text-red-300 border-red-500/40 bg-red-500/10",
};

function stepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  const i = statusSteps.indexOf(status);
  return i >= 0 ? i : 0;
}

export function OrderTrackingDetails({
  order,
  compact = false,
}: {
  order: TrackedOrder;
  compact?: boolean;
}) {
  const current = stepIndex(order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className={`space-y-5 ${compact ? "text-sm" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            Order
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl text-gold-bright tracking-wide">
            {order.order_number}
          </p>
          <p className="mt-1 text-xs text-muted">
            {new Date(order.created_at).toLocaleString("en-PK")}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${statusColors[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      {!cancelled && (
        <ol className="flex gap-1">
          {statusSteps.map((step, i) => {
            const done = i <= current;
            const active = i === current;
            return (
              <li key={step} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    done ? "bg-gold" : "bg-[var(--border)]"
                  } ${active ? "ring-1 ring-gold/40" : ""}`}
                />
                <p
                  className={`mt-1.5 text-[0.55rem] uppercase tracking-wider ${
                    done ? "text-cream/80" : "text-muted"
                  }`}
                >
                  {statusLabels[step]}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      <div className="border border-[var(--border)] p-4 space-y-2 text-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">
          Delivery
        </p>
        <p className="text-cream">{order.customer_name}</p>
        <p className="text-muted">{order.phone}</p>
        <p className="text-muted">
          {order.address}, {order.city}
        </p>
        {order.notes && (
          <p className="text-muted pt-1 border-t border-[var(--border)]">
            Note: {order.notes}
          </p>
        )}
      </div>

      <div className="border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="text-[0.6rem] uppercase tracking-wider text-muted border-b border-[var(--border)] bg-white/[0.02]">
            <tr>
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium text-right">Line</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={`${item.product_name}-${item.quantity}`}
                className="border-b border-[var(--border)]/60 last:border-0"
              >
                <td className="p-3 text-cream">{item.product_name}</td>
                <td className="p-3 text-muted">{item.quantity}</td>
                <td className="p-3 text-right text-cream/90">
                  {formatPKR(Number(item.line_total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 text-sm border-t border-[var(--border)] pt-4">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="text-cream">{formatPKR(Number(order.subtotal))}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span className="text-cream">
            {Number(order.shipping_fee) === 0
              ? "Free"
              : formatPKR(Number(order.shipping_fee))}
          </span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-cream">Total · COD</span>
          <span className="text-gold-bright font-[family-name:var(--font-display)] text-lg">
            {formatPKR(Number(order.total))}
          </span>
        </div>
      </div>

      {!compact && (
        <Link
          href="/account"
          className="block text-center text-xs uppercase tracking-[0.15em] text-muted hover:text-gold"
        >
          View in My Profile →
        </Link>
      )}
    </div>
  );
}
