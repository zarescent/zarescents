"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      setError("This account is not authorized as admin.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0908] px-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(212,175,100,0.1), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-md border border-[var(--border)] bg-gradient-to-b from-[#161310] to-[#0e0c0b] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-8 text-center">
          <BrandLogo />
          <div className="mt-5 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-muted">
            <Lock size={12} strokeWidth={1.5} className="text-gold" />
            Admin access
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="admin-label">Email</span>
            <input
              name="email"
              type="email"
              required
              className="input-field"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="admin-label">Password</span>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="input-field pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </label>
          {error && (
            <p className="rounded border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
