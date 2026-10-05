import type { ReactNode } from "react";
import Link from "next/link";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-32 md:pt-36 pb-20 md:pb-28">
      <div className="container-zare px-5 md:px-8 max-w-3xl mx-auto">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
          {eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
        <div className="gold-rule mt-8 w-16" />

        <div className="legal-prose mt-10 space-y-8 text-muted leading-relaxed">
          {children}
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/terms"
            className="text-muted hover:text-gold transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-muted hover:text-gold transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className="text-muted hover:text-gold transition-colors"
          >
            Refund & Exchange
          </Link>
          <Link
            href="/shipping-policy"
            className="text-muted hover:text-gold transition-colors"
          >
            Shipping Policy
          </Link>
          <Link
            href="/contact"
            className="text-muted hover:text-gold transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[0.95rem]">{children}</div>
    </section>
  );
}
