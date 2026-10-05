"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SITE } from "@/lib/site";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPKR } from "@/lib/types";

const faqs = [
  {
    q: "Are Zaré fragrances original designer perfumes?",
    a: "No. All our fragrances are premium impressions inspired by designer scents. We are not affiliated with the designer brands.",
  },
  {
    q: "How long do Zaré scents last?",
    a: "Our blends use 30%+ concentration and are crafted for roughly 10–12 hours of lasting wear, depending on skin type and climate.",
  },
  {
    q: "Do you deliver across Pakistan?",
    a: "Yes. We deliver to all cities across Pakistan. Standard delivery is 2–4 working days; Karachi, Lahore, and Islamabad usually arrive in 1–2 working days.",
  },
  {
    q: "What are the shipping charges?",
    a: `Delivery is free on orders above ${formatPKR(FREE_SHIPPING_THRESHOLD)}. Orders below that have a flat ${formatPKR(SHIPPING_FEE)} delivery charge, shown at checkout.`,
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Cash on Delivery (COD) only. Pay when your order arrives.",
  },
  {
    q: "Can I return or exchange a perfume?",
    a: "Due to hygiene, we cannot accept returns if the seal has been broken, sprayed, or used. Damaged, leaked, or wrong items must be reported within 48 hours of delivery with an unboxing video.",
  },
  {
    q: "How do I track my order?",
    a: `Use the Track Order button on the site (below WhatsApp), or open My Profile, and enter your order number plus the email used at checkout to see live status and order details. You can also message us on WhatsApp at ${SITE.phoneDisplay} or email ${SITE.email}.`,
  },
  {
    q: "How can I contact Zaré?",
    a: `Email us at ${SITE.email}, message us on WhatsApp at ${SITE.phoneDisplay}, or reach out on Instagram @zare_scents.`,
  },
];

export function AboutFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-pad border-t border-[var(--border)]">
      <div className="container-zare px-5 md:px-8 max-w-3xl mx-auto">
        <FadeIn className="text-center mb-12 md:mb-14">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
            FAQs
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
            Frequently Asked Questions
          </h2>
          <div className="gold-rule mx-auto mt-6 w-16" />
          <p className="mt-5 text-sm text-muted max-w-md mx-auto">
            Quick answers about our scents, shipping, and orders.
          </p>
        </FadeIn>

        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <FadeIn key={item.q} delay={Math.min(i * 0.03, 0.15)}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-start justify-between gap-4 py-5 md:py-6 text-left group"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg md:text-xl text-cream group-hover:text-gold-bright transition-colors pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--border)] text-gold transition-transform duration-200 ${
                        open ? "rotate-45 border-gold/40" : ""
                      }`}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 md:pb-6 text-sm md:text-[0.95rem] text-muted leading-relaxed max-w-2xl">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
