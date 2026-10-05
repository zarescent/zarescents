import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrders, isCurrentUserAdmin } from "@/lib/products";
import { formatPKR } from "@/lib/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
  const orders = await getOrders();

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div>
      <div className="mb-8">
        <p className="admin-section-label">Fulfillment</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
          Orders
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["Pending", counts.pending],
              ["Confirmed", counts.confirmed],
              ["Shipped", counts.shipped],
              ["Delivered", counts.delivered],
            ] as const
          ).map(([label, n]) => (
            <span key={label} className="admin-chip">
              {label} · {n}
            </span>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table min-w-[860px]">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>City</th>
              <th>Total</th>
              <th>Badge</th>
              <th>Update status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-gold-bright hover:underline font-medium"
                  >
                    {o.order_number}
                  </Link>
                </td>
                <td>
                  <p className="text-cream">{o.customer_name}</p>
                  <p className="text-xs text-muted">{o.phone}</p>
                </td>
                <td className="text-muted">{o.city}</td>
                <td>{formatPKR(Number(o.total))}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td>
                  <OrderStatusSelect
                    orderId={o.id}
                    current={o.status}
                    compact
                  />
                </td>
                <td className="text-muted text-xs whitespace-nowrap">
                  {new Date(o.created_at).toLocaleString("en-PK")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="!py-10 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
