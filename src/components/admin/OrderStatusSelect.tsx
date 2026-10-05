"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  orderId,
  current,
  compact = false,
}: {
  orderId: string;
  current: OrderStatus;
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);

  async function onChange(next: OrderStatus) {
    if (next === value) return;
    const prev = value;
    setValue(next);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_set_order_status", {
      p_order_id: orderId,
      p_status: next,
    });
    setSaving(false);
    if (error) {
      alert(error.message);
      setValue(prev);
      return;
    }
    router.refresh();
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "gap-3"}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        className={
          compact
            ? "admin-status-select capitalize"
            : "input-field max-w-xs capitalize"
        }
        disabled={saving}
        aria-label="Order status"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saving && <span className="text-[0.65rem] text-muted shrink-0">Saving…</span>}
    </div>
  );
}
