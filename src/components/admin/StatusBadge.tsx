import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  shipped: "bg-violet-500/15 text-violet-200 border-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}
