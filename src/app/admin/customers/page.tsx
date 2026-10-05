import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrders, isCurrentUserAdmin } from "@/lib/products";
import { formatPKR } from "@/lib/types";

export const metadata: Metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  if (!(await isCurrentUserAdmin())) redirect("/admin/login");
  const orders = await getOrders();

  const map = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      city: string;
      orders: number;
      spent: number;
      lastOrder: string;
    }
  >();

  for (const o of orders) {
    const key = o.email.toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        name: o.customer_name,
        email: o.email,
        phone: o.phone,
        city: o.city,
        orders: 1,
        spent: o.status === "cancelled" ? 0 : Number(o.total),
        lastOrder: o.created_at,
      });
    } else {
      existing.orders += 1;
      if (o.status !== "cancelled") existing.spent += Number(o.total);
      if (o.created_at > existing.lastOrder) {
        existing.lastOrder = o.created_at;
        existing.name = o.customer_name;
        existing.phone = o.phone;
        existing.city = o.city;
      }
    }
  }

  const customers = Array.from(map.values()).sort((a, b) => b.spent - a.spent);

  return (
    <div>
      <div className="mb-8">
        <p className="admin-section-label">Audience</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream">
          Customers
        </h1>
        <p className="mt-2 text-sm text-muted">
          Guests collected from checkout. {customers.length} unique email
          {customers.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table min-w-[720px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>City</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email}>
                <td className="text-cream font-medium">{c.name}</td>
                <td>
                  <p className="text-muted text-xs">{c.email}</p>
                  <p className="text-muted text-xs">{c.phone}</p>
                </td>
                <td className="text-muted">{c.city}</td>
                <td>{c.orders}</td>
                <td className="text-gold-bright">{formatPKR(c.spent)}</td>
                <td className="text-muted text-xs">
                  {new Date(c.lastOrder).toLocaleDateString("en-PK")}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="!py-10 text-center text-muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
