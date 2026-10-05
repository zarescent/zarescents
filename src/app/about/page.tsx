import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { AboutFaq } from "@/components/AboutFaq";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Welcome to Zaré: premium, long-lasting impressions of designer fragrances. Born in Pakistan, made for everyone who loves to leave a memory behind.",
};

const pillars = [
  {
    num: "01",
    title: "Premium Quality",
    body: "30%+ concentration for 10–12 hours of lasting presence. A scent that stays with you from morning to night.",
  },
  {
    num: "02",
    title: "Affordable Luxury",
    body: "Designer-inspired impressions at a fair price. Smell expensive every day, without the designer markup.",
  },
  {
    num: "03",
    title: "Crafted with Care",
    body: "Every bottle is tested and packed with love. From blend to box, we obsess over the details that matter.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero. full bleed */}
      <section className="relative min-h-[85svh] min-h-[85dvh] flex items-end overflow-hidden">
        <Image
          src="/images/about-craft.jpg"
          alt="Zaré craftsmanship"
          fill
          className="object-cover object-center scale-[1.02]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/55 to-[#0c0b0a]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,11,10,0.45)_100%)]" />

        <div className="relative z-[1] container-zare w-full px-5 md:px-8 pb-16 md:pb-24 pt-36">
          <FadeIn>
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold-bright mb-5">
              Our Story
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] gold-text font-semibold leading-none">
              ZARÉ
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-cream/80 leading-relaxed">
              Not just a perfume brand. It&apos;s a statement.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative section-pad overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,100,0.08), transparent 65%)",
          }}
        />
        <div className="relative container-zare px-5 md:px-8 max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold mb-6">
              Welcome to Zaré
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl text-cream leading-[1.15]">
              A great scent shouldn&apos;t cost a fortune.
            </h2>
            <div className="gold-rule mx-auto mt-8 w-20" />
            <p className="mt-8 text-muted text-base md:text-lg leading-relaxed">
              That&apos;s why we create premium, long-lasting impressions of your
              favorite designer fragrances, crafted with high-quality oils to
              make you smell expensive, every day.
            </p>
            <p className="mt-5 text-cream/85 text-base md:text-lg leading-relaxed font-[family-name:var(--font-display)] italic text-xl md:text-2xl">
              Born in Pakistan, made for everyone who loves to leave a memory
              behind.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Split. craft visual */}
      <section className="relative border-y border-[var(--border)]">
        <div className="grid lg:grid-cols-2 min-h-[min(70vh,640px)]">
          <FadeIn className="relative min-h-[320px] lg:min-h-full order-1">
            <Image
              src="/images/hero-perfect.jpg"
              alt="Zaré signature bottle"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0c0b0a]/40" />
          </FadeIn>

          <div className="relative flex items-center order-2 px-5 sm:px-8 md:px-12 lg:px-16 py-14 md:py-20 bg-[#0c0b0a]">
            <FadeIn delay={0.06} className="max-w-md">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold mb-4">
                The Promise
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream leading-tight">
                Smell expensive.
                <br />
                <span className="gold-text italic">Every day.</span>
              </h2>
              <p className="mt-6 text-muted leading-relaxed">
                We blend high-quality oils into long-lasting compositions:
                impressions inspired by the scents you love, finished with the
                presence you deserve.
              </p>
              <Link href="/shop" className="btn-gold mt-8 inline-flex">
                Shop Collection
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Zaré */}
      <section className="section-pad">
        <div className="container-zare px-5 md:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
              Why Zaré
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
              Crafted for presence
            </h2>
            <div className="gold-rule mx-auto mt-6 w-16" />
          </FadeIn>

          <div className="max-w-4xl mx-auto divide-y divide-[var(--border)]">
            {pillars.map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.05}>
                <div className="grid sm:grid-cols-[5rem_1fr] gap-4 sm:gap-8 py-8 md:py-10">
                  <p className="font-[family-name:var(--font-display)] text-3xl text-gold/70 leading-none pt-1">
                    {item.num}
                  </p>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-muted leading-relaxed max-w-xl">
                      {item.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="border-y border-[var(--border)] bg-[#0c0b0a]">
        <div className="container-zare px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {[
              { value: "30%+", label: "Oil concentration" },
              { value: "10–12hr", label: "Lasting wear" },
              { value: "PK", label: "Born in Pakistan" },
            ].map((stat, i) => (
              <FadeIn
                key={stat.label}
                delay={i * 0.04}
                className="py-10 md:py-12 text-center sm:border-l sm:border-[var(--border)] first:border-l-0"
              >
                <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl gold-text">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.25em] text-muted">
                  {stat.label}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AboutFaq />
    </div>
  );
}
