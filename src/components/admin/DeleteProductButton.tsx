"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="text-danger/80 hover:text-danger text-xs uppercase tracking-wider"
    >
      Delete
    </button>
  );
}
