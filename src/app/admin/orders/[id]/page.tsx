import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderById, isCurrentUserAdmin } from "@/lib/products";
import { formatPKR } from "@/lib/types";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Order Detail" };
export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-[0.65rem] uppercase tracking-[0.15em] text-muted hover:text-cream"
      >
        ← Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
              {order.order_number}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {new Date(order.created_at).toLocaleString("en-PK")} · Cash on Delivery
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="admin-card p-5 space-y-2 text-sm">
          <h2 className="admin-section-label">Customer</h2>
          <p className="text-cream text-base">{order.customer_name}</p>
          <p className="text-muted">{order.email}</p>
          <p className="text-muted">{order.phone}</p>
          <p className="text-muted pt-1">
            {order.address}, {order.city}
          </p>
          {order.notes && (
            <p className="pt-3 border-t border-[var(--border)] text-muted">
              Notes: {order.notes}
            </p>
          )}
        </div>

        <div className="admin-card p-5 space-y-4 text-sm">
          <h2 className="admin-section-label">Fulfillment status</h2>
          <p className="text-muted text-xs -mt-2">
            Update as the order progresses. Customers see COD confirmation only.
          </p>
          <OrderStatusSelect orderId={order.id} current={order.status} />
          <div className="pt-2 space-y-2 border-t border-[var(--border)]">
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
            <div className="flex justify-between text-base pt-1">
              <span>Total</span>
              <span className="text-gold-bright font-[family-name:var(--font-display)] text-xl">
                {formatPKR(Number(order.total))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="admin-section-label mb-3">Line items</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Line</th>
            </tr>
          </thead>
          <tbody>
            {(order.order_items || []).map((item) => (
              <tr key={item.id}>
                <td className="text-cream">{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{formatPKR(Number(item.unit_price))}</td>
                <td>{formatPKR(Number(item.line_total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
