import { Clock, ShieldCheck, Truck, Wallet } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, formatPKR } from "@/lib/types";

const items = [
  {
    value: "12hr+",
    label: "Long Lasting",
    Icon: Clock,
  },
  {
    value: "100%",
    label: "Authentic",
    Icon: ShieldCheck,
  },
  {
    value: `${formatPKR(FREE_SHIPPING_THRESHOLD)}+`,
    label: "Free Delivery",
    Icon: Truck,
  },
  {
    value: "COD",
    label: "Cash on Delivery",
    Icon: Wallet,
  },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-[var(--border)] bg-[#0c0b0a]">
      <div className="container-zare grid grid-cols-2 lg:grid-cols-4 px-3 sm:px-5 md:px-8">
        {items.map(({ value, label, Icon }, i) => (
          <div
            key={label}
            className={`flex items-center justify-center gap-3 px-3 py-4 sm:py-5 ${
              i % 2 === 1 ? "border-l border-[var(--border)]" : ""
            } ${
              i >= 2 ? "border-t border-[var(--border)] lg:border-t-0" : ""
            } lg:border-l lg:border-[var(--border)] lg:first:border-l-0`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-gold">
              <Icon size={15} strokeWidth={1.4} />
            </div>
            <div className="text-left min-w-0">
              <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl gold-text leading-none tracking-wide">
                {value}
              </p>
              <p className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-muted truncate">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
