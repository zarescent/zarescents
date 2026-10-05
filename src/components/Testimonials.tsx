import { Star } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const reviews = [
  {
    q: "The fragrances are absolutely divine. Long-lasting and the packaging feels so premium. My new go-to perfume brand.",
    a: "Ayesha K.",
    c: "Karachi",
    initial: "A",
  },
  {
    q: "Best value I've found. The oud collection is incredible. Compliments every single day.",
    a: "Hassan R.",
    c: "Lahore",
    initial: "H",
  },
  {
    q: "Fast delivery, beautiful bottles, and scents that actually last 8+ hours. Exceeded every expectation.",
    a: "Sana M.",
    c: "Islamabad",
    initial: "S",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-gold" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [featured, ...rest] = reviews;

  return (
    <section className="relative overflow-hidden bg-[#0c0b0a] border-t border-[var(--border)]">
      <div className="container-zare px-5 md:px-8 py-14 md:py-20">
        <FadeIn className="text-center mb-12 md:mb-16">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
            Voices
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
            Loved Across Pakistan
          </h2>
          <div className="gold-rule mx-auto mt-5 w-20" />
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-0 lg:items-stretch">
          {/* Featured quote */}
          <FadeIn className="lg:col-span-7 lg:pr-12 lg:border-r lg:border-[var(--border)]">
            <div className="relative h-full flex flex-col justify-center">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-[7rem] md:text-[9rem] leading-none text-gold/15 absolute -top-8 -left-2 select-none"
              >
                “
              </span>
              <div className="relative pt-10">
                <Stars />
                <p className="mt-5 font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-[2.15rem] text-cream leading-snug">
                  {featured.q}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold font-[family-name:var(--font-display)] text-lg">
                    {featured.initial}
                  </div>
                  <div>
                    <p className="text-sm text-gold tracking-wide">{featured.a}</p>
                    <p className="text-xs text-muted uppercase tracking-[0.16em] mt-0.5">
                      {featured.c}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Side quotes */}
          <div className="lg:col-span-5 lg:pl-12 flex flex-col justify-center gap-0">
            {rest.map((t, i) => (
              <FadeIn key={t.a} delay={0.08 + i * 0.06}>
                <div
                  className={`py-7 ${
                    i === 0 ? "border-b border-[var(--border)]" : "pt-7"
                  }`}
                >
                  <Stars />
                  <p className="mt-3 text-cream/90 leading-relaxed text-[0.95rem]">
                    “{t.q}”
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold text-sm font-[family-name:var(--font-display)]">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm text-gold">{t.a}</p>
                      <p className="text-[0.65rem] text-muted uppercase tracking-[0.14em]">
                        {t.c}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
