import Link from "next/link";
import { getProducts } from "@/lib/products";
import { HeroMedia } from "@/components/HeroMedia";
import { TrustStrip } from "@/components/TrustStrip";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductShelf } from "@/components/ProductShelf";
import { CraftStory } from "@/components/CraftStory";
import { Testimonials } from "@/components/Testimonials";

export const revalidate = 60;

export default async function HomePage() {
  const [newArrivals, mostPopular] = await Promise.all([
    getProducts({ collection: "new", limit: 6 }),
    getProducts({ collection: "popular", limit: 6 }),
  ]);

  return (
    <>
      <section className="relative min-h-[100svh] min-h-[100dvh] flex items-end md:items-center overflow-hidden">
        <HeroMedia />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/75 to-[#0c0b0a]/40 md:hidden" />
        <div className="absolute inset-0 z-[1] hidden md:block bg-gradient-to-r from-[#0c0b0a] via-[#0c0b0a]/55 to-transparent md:via-[#0c0b0a]/30" />
        <div className="absolute inset-0 z-[1] hidden md:block bg-gradient-to-t from-[#0c0b0a]/50 via-transparent to-[#0c0b0a]/35" />

        <div className="relative z-[2] container-zare w-full px-5 sm:px-6 md:px-8 pb-10 pt-24 safe-pb sm:pb-14 md:py-28">
          <div className="max-w-xl animate-fade-up mx-auto md:mx-0 text-center md:text-left">
            <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.35em] sm:tracking-[0.4em] text-gold-bright mb-3 sm:mb-4">
              Parfums de Luxe
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[2.35rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-cream">
              Discover Your{" "}
              <span className="gold-text italic">Signature</span> Scent
            </h1>
            <p className="mt-4 sm:mt-5 max-w-md mx-auto md:mx-0 text-sm sm:text-base md:text-lg text-cream/75 leading-relaxed">
              Long-lasting, luxurious fragrances crafted for those who dare to
              leave a lasting impression.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start w-full sm:w-auto">
              <Link href="/shop" className="btn-gold w-full sm:w-auto">
                Shop Collection
              </Link>
              <Link href="/about" className="btn-outline w-full sm:w-auto">
                Our Craft
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <CategoryShowcase />

      <ProductShelf
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/shop?collection=new"
        viewAllLabel="View All New Arrivals"
        emptyHint="Run supabase/schema.sql in Supabase to seed new arrivals."
      />

      <ProductShelf
        eyebrow="Bestsellers"
        title="Most Popular"
        products={mostPopular}
        viewAllHref="/shop?collection=popular"
        viewAllLabel="View All Bestsellers"
        emptyHint="Run supabase/schema.sql in Supabase to seed bestsellers."
      />

      <CraftStory />

      <Testimonials />
    </>
  );
}
