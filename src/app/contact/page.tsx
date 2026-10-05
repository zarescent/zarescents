import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Zaré Scents for scent advice, order updates, and support across Pakistan.",
};

const channels = [
  {
    label: "Email",
    value: SITE.email,
    href: SITE.mailto,
  },
  {
    label: "Phone / WhatsApp",
    value: SITE.phoneDisplay,
    href: SITE.whatsapp,
    external: true,
  },
  {
    label: "Instagram",
    value: "@zare_scents",
    href: SITE.instagram,
    external: true,
  },
  {
    label: "TikTok",
    value: "@zare.scents",
    href: SITE.tiktok,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[55svh] min-h-[55dvh] flex items-end overflow-hidden">
        <Image
          src="/images/about-craft.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/65 to-[#0c0b0a]/35" />
        <div className="relative z-[1] container-zare w-full px-5 md:px-8 pb-14 md:pb-20 pt-36">
          <FadeIn>
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold-bright mb-4">
              Reach Us
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl lg:text-7xl text-cream leading-none">
              Contact Us
            </h1>
            <p className="mt-5 max-w-lg text-cream/75 text-base md:text-lg leading-relaxed">
              Questions about an order, a scent note, or wholesale? Write to us.
              We typically reply within 24 hours.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-zare px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">
            {/* Details */}
            <FadeIn className="lg:col-span-5">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
                Get in touch
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream leading-tight">
                We&apos;d love to hear from you
              </h2>
              <div className="gold-rule mt-6 w-14" />
              <p className="mt-6 text-muted leading-relaxed">
                Scent advice, delivery updates, or partnership inquiries.
                Reach out anytime. For the fastest reply, WhatsApp works best.
              </p>

              <ul className="mt-10 space-y-0 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {channels.map((item) => (
                  <li key={item.label} className="py-5">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold mb-1.5">
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-cream hover:text-gold-bright transition-colors text-base md:text-lg"
                    >
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm text-muted">
                Cash on Delivery available across Pakistan.
              </p>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.06} className="lg:col-span-7">
              <div className="relative border border-[var(--border)] p-6 sm:p-8 md:p-10 bg-[#0c0b0a]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(212,175,100,0.08), transparent 55%)",
                  }}
                />
                <div className="relative">
                  <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-2">
                    Send a message
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream mb-8">
                    Tell us how we can help
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
