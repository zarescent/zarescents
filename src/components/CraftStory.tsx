import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

const pillars = [
  { label: "Longevity", value: "12hr+" },
  { label: "Ingredients", value: "Premium" },
  { label: "Finish", value: "Parfum" },
];

export function CraftStory() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[#0c0b0a]">
      <div className="container-zare relative grid lg:grid-cols-12 min-h-[min(88vh,820px)]">
        {/* Visual. full height on desktop */}
        <FadeIn className="relative lg:col-span-7 min-h-[320px] sm:min-h-[420px] lg:min-h-full">
          <div className="absolute inset-0 lg:inset-y-0 lg:left-0 lg:right-8">
            <Image
              src="/images/about-craft.jpg"
              alt="Zaré craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0c0b0a]/80 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-transparent to-transparent lg:hidden" />

            {/* Gold corner frame */}
            <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-gold/20" />
            <div className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6 h-10 w-10 border-l border-t border-gold/55" />
            <div className="pointer-events-none absolute right-4 bottom-4 sm:right-6 sm:bottom-6 h-10 w-10 border-r border-b border-gold/55" />

            <div className="absolute left-6 bottom-6 sm:left-8 sm:bottom-8 hidden sm:block">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold-bright/90">
                Parfums de Luxe
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-cream">
                Since the first blend
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Copy */}
        <div className="relative lg:col-span-5 flex items-center px-5 sm:px-8 lg:px-4 lg:pr-8 py-12 lg:py-16">
          <FadeIn delay={0.08} className="w-full max-w-md lg:max-w-none">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold mb-4">
              The Atelier
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-[3.25rem] text-cream leading-[1.08]">
              Crafted,
              <br />
              <span className="gold-text italic">Not Copied</span>
            </h2>
            <div className="gold-rule mt-6 w-16" />

            <p className="mt-6 text-muted leading-relaxed text-[0.95rem] md:text-base">
              Every Zaré fragrance is a story: personal, powerful, and unlike
              anything else. We blend premium ingredients to create scents that
              linger from morning to midnight.
            </p>

            <blockquote className="relative mt-8 pl-5">
              <span className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />
              <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl italic text-cream/90 leading-snug">
                “Built with bold blends and clean ingredients that truly last.
                Your signature scent deserves nothing less.”
              </p>
            </blockquote>

            <div className="mt-9 grid grid-cols-3 gap-3 border-y border-[var(--border)] py-5">
              {pillars.map((p) => (
                <div key={p.label} className="text-center">
                  <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl gold-text">
                    {p.value}
                  </p>
                  <p className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-muted">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-gold mt-8 inline-flex">
              Read Our Story
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
