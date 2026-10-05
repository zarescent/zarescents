"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=him", label: "For Him" },
  { href: "/shop?category=her", label: "For Her" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[#0c0b0a] shadow-[0_1px_0_rgba(212,175,100,0.06)]">
      <div className="container-zare flex h-[4.25rem] md:h-[5.25rem] items-center justify-between px-5 md:px-8">
        <button
          type="button"
          className="md:hidden text-gold-bright"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className="hidden md:flex items-center gap-8 text-[0.7rem] uppercase tracking-[0.22em] text-muted">
          {links.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-gold-bright transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <BrandLogo className="absolute left-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-[0.7rem] uppercase tracking-[0.22em] text-muted">
            {links.slice(3).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-gold-bright transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/account"
            className="hidden md:inline-flex text-muted hover:text-gold-bright transition-colors"
            aria-label="My profile"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="relative text-gold-bright hover:opacity-80 transition-opacity"
            aria-label="Open shopping bag"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-semibold text-[#1a1410]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[#0c0b0a] px-5 py-6">
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em] text-cream">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="py-1">
                {l.label}
              </Link>
            ))}
            <Link href="/account" className="py-1 text-gold">
              My Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
