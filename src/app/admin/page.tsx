import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Clock,
  Users,
  Banknote,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { getOrders, getAdminProducts, isCurrentUserAdmin } from "@/lib/products";
import { formatPKR } from "@/lib/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");

  const [products, orders] = await Promise.all([
    getAdminProducts(),
    getOrders(),
  ]);

  const pending = orders.filter((o) => o.status === "pending").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((n, o) => n + Number(o.total), 0);
  const customers = new Set(orders.map((o) => o.email.toLowerCase())).size;
  const lowStock = products.filter((p) => p.active && p.stock <= 5).length;
  const featured = products.filter((p) => p.featured).length;

  const stats = [
    {
      label: "Revenue",
      value: formatPKR(revenue),
      href: "/admin/orders",
      icon: Banknote,
      hint: "Excludes cancelled",
    },
    {
      label: "Orders",
      value: String(orders.length),
      href: "/admin/orders",
      icon: ShoppingBag,
      hint: `${pending} pending`,
    },
    {
      label: "Products",
      value: String(products.length),
      href: "/admin/products",
      icon: Package,
      hint: `${featured} featured`,
    },
    {
      label: "Customers",
      value: String(customers),
      href: "/admin/customers",
      icon: Users,
      hint: "From checkout",
    },
    {
      label: "Pending",
      value: String(pending),
      href: "/admin/orders",
      icon: Clock,
      hint: lowStock ? `${lowStock} low stock` : "All clear",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="admin-section-label">Overview</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="btn-gold !min-h-0 !py-2.5 !px-4">
            <Plus size={15} strokeWidth={2} />
            Add product
          </Link>
          <Link href="/admin/orders" className="btn-outline !min-h-0 !py-2.5 !px-4">
            Manage orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="admin-stat group">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted">
                  {s.label}
                </p>
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  className="text-gold/50 group-hover:text-gold transition-colors"
                />
              </div>
              <p className="mt-3 text-xl md:text-2xl text-gold-bright font-[family-name:var(--font-display)] leading-none">
                {s.value}
              </p>
              <p className="mt-2 text-[0.65rem] text-muted flex items-center gap-1">
                {s.hint}
                <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="admin-section-label mb-0">Recent orders</h2>
        <Link
          href="/admin/orders"
          className="text-[0.65rem] uppercase tracking-[0.15em] text-muted hover:text-gold"
        >
          View all
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table min-w-[720px]">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Badge</th>
              <th>Update status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 8).map((o) => (
              <tr key={o.id}>
                <td>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-gold-bright hover:underline font-medium"
                  >
                    {o.order_number}
                  </Link>
                  <p className="text-[0.65rem] text-muted mt-0.5">
                    {new Date(o.created_at).toLocaleDateString("en-PK")}
                  </p>
                </td>
                <td className="text-cream/85">{o.customer_name}</td>
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
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="!py-10 text-center text-muted">
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
