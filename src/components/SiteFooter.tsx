"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE } from "@/lib/site";
import { FREE_SHIPPING_THRESHOLD, formatPKR } from "@/lib/types";

const shopLinks = [
  { href: "/shop", label: "All Fragrances" },
  { href: "/shop?category=him", label: "For Him" },
  { href: "/shop?category=her", label: "For Her" },
  { href: "/shop?category=unisex", label: "Unisex" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const policyLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Exchange" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto relative overflow-hidden border-t border-[var(--border)] bg-[#0c0b0a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,100,0.12), transparent 70%)",
        }}
      />

      <div className="relative container-zare px-5 md:px-8 pt-14 md:pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo className="inline-block" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Luxury long-lasting fragrances crafted for those who leave a
              lasting impression. Delivered across Pakistan with Cash on
              Delivery.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.mailto}
                  className="inline-flex items-center gap-2.5 text-muted hover:text-cream transition-colors"
                >
                  <Mail size={15} className="text-gold shrink-0" strokeWidth={1.5} />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-muted hover:text-cream transition-colors"
                >
                  <MessageCircle
                    size={15}
                    className="text-gold shrink-0"
                    strokeWidth={1.5}
                  />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-muted">
                <MapPin size={15} className="text-gold shrink-0" strokeWidth={1.5} />
                Delivering across Pakistan
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zaré Scents on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border)] text-gold hover:border-gold/50 hover:text-gold-bright transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zaré Scents on TikTok"
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border)] text-gold hover:border-gold/50 hover:text-gold-bright transition-colors"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-8">
            <FooterCol title="Shop" links={shopLinks} />
            <FooterCol title="Company" links={companyLinks} />
            <FooterCol
              title="Policies"
              links={policyLinks}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border)]">
          {[
            { label: "Cash on Delivery", sub: "Pay when you receive" },
            {
              label: "Free Shipping",
              sub: `On orders ${formatPKR(FREE_SHIPPING_THRESHOLD)}+`,
            },
            { label: "Authentic Scents", sub: "Long-lasting compositions" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0c0b0a] px-5 py-5 text-center sm:text-left"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">
                {item.label}
              </p>
              <p className="mt-1.5 text-sm text-muted">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="gold-rule mt-12" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs tracking-wide text-muted">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>
            Made by{" "}
            <a
              href="#"
              className="text-gold hover:text-gold-bright transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              {SITE.maker.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-[0.7rem] uppercase tracking-[0.25em] text-gold">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.86.14V9.01a6.27 6.27 0 0 0-.86-.06A6.33 6.33 0 0 0 3.16 15.27 6.33 6.33 0 0 0 9.49 21.6a6.33 6.33 0 0 0 6.33-6.33V8.73a8.18 8.18 0 0 0 4.78 1.52V6.85a4.85 4.85 0 0 1-1.01-.16z" />
    </svg>
  );
}
