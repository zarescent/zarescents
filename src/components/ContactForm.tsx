"use client";

import { FormEvent, useState } from "react";
import { SITE } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "opening" | "done">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Message from ${name} | Zaré Scents`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\n${message}`
    );

    setStatus("opening");
    window.location.href = `${SITE.mailto}?subject=${subject}&body=${body}`;
    window.setTimeout(() => setStatus("done"), 600);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            Name *
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="input-field"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            Email *
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="input-field"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          Phone / WhatsApp
        </span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="03XX XXXXXXX"
          className="input-field"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          Message *
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="input-field resize-none min-h-[140px]"
        />
      </label>

      <button
        type="submit"
        className="btn-gold w-full sm:w-auto"
        disabled={status === "opening"}
      >
        {status === "opening" ? "Opening email…" : "Send Message"}
      </button>

      {status === "done" ? (
        <p className="text-sm text-muted">
          Your email app should open with the message ready. If it doesn&apos;t,
          write to{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
