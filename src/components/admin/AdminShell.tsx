"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="admin-shell min-h-screen">
      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop lg:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}
      >
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[var(--border)]">
          <BrandLogo compact />
          <div className="min-w-0 flex-1">
            <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
              Control
            </p>
            <p className="truncate text-xs text-muted">Admin panel</p>
          </div>
          <button
            type="button"
            className="lg:hidden text-muted hover:text-cream p-1"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`admin-nav-link ${active ? "is-active" : ""}`}
              >
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="admin-nav-link"
          >
            <ExternalLink size={16} strokeWidth={1.5} />
            View store
          </Link>
          <button
            type="button"
            onClick={logout}
            className="admin-nav-link w-full text-left hover:!text-danger"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <button
          type="button"
          className="admin-menu-trigger lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-[0.15em]">Menu</span>
        </button>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
