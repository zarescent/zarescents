"use client";

import { useEffect } from "react";
import Link from "next/link";
import { saveOrderRef } from "@/lib/order-tracking";

export function OrderSuccessSave({
  orderNumber,
  email,
}: {
  orderNumber?: string;
  email?: string;
}) {
  useEffect(() => {
    if (orderNumber && email) {
      saveOrderRef(orderNumber, email);
    }
  }, [orderNumber, email]);

  if (!orderNumber) return null;

  return (
    <Link
      href="/account"
      className="mt-6 inline-block text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-bright"
    >
      View in My Profile →
    </Link>
  );
}
