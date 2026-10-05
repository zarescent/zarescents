"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const categories = [
  {
    href: "/shop?category=him",
    title: "For Him",
    desc: "Masculine depth and character",
    img: "/images/product-noir.jpg",
    tone: "Bold & Sophisticated",
  },
  {
    href: "/shop?category=her",
    title: "For Her",
    desc: "Feminine scents that captivate",
    img: "/images/product-velvet.jpg",
    tone: "Elegant & Enchanting",
  },
  {
    href: "/shop?category=unisex",
    title: "Unisex",
    desc: "Fragrances beyond boundaries",
    img: "/images/product-aura.jpg",
    tone: "Timeless & Universal",
  },
];

export function CategoryShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#0c0b0a] pt-12 md:pt-16 pb-14 md:pb-20">
      <div className="container-zare relative px-5 md:px-8">
        <FadeIn className="text-center mb-8 md:mb-10">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
            Collections
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted max-w-md mx-auto text-sm md:text-base">
            Find the perfect fragrance for every mood, moment, and personality.
          </p>
          <div className="gold-rule mx-auto mt-5 w-20" />
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <FadeIn key={cat.href} delay={i * 0.07}>
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden bg-[#0c0b0a] ring-1 ring-inset ring-white/5 transition-[box-shadow] duration-500 hover:ring-gold/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  className="object-cover object-center scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width:768px) 100vw, 33vw"
                />

                {/* Flatten photo mid-tone so panels don't show a shared gray band */}
                <div className="absolute inset-0 bg-[#0c0b0a]/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/55 to-[#0c0b0a]/15" />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-gold/10 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-7">
                  <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold mb-2">
                    {cat.tone}
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-cream tracking-wide">
                        {cat.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-cream/65 max-w-[16rem]">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center border border-gold/35 text-gold transition-all duration-400 group-hover:bg-gold group-hover:text-[#1a1410]">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="gold-rule mt-5 w-10 opacity-60 transition-all duration-500 group-hover:w-20 group-hover:opacity-100" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
