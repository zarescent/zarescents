import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/products";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { formatPKR, CATEGORY_LABELS } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.short_description || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Zaré Scents`,
      description: product.short_description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts({ category: product.category }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const gallery =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls.filter(Boolean)
      : product.image_url
        ? [product.image_url]
        : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: gallery.length ? gallery : product.image_url,
    brand: { "@type": "Brand", name: "Zaré Scents" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pt-32 md:pt-36 section-pad !pt-32 md:!pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-zare px-5 md:px-8">
        <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-muted">
          <Link href="/shop" className="hover:text-cream">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <ProductGallery images={gallery} name={product.name} />

          <div className="flex flex-col justify-center">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-gold">
              {CATEGORY_LABELS[product.category]} · {product.volume} · Parfum
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
              {product.name}
            </h1>
            <p className="mt-3 text-muted">{product.short_description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl text-gold-bright">
                {formatPKR(Number(product.price))}
              </span>
              {product.compare_at_price &&
                Number(product.compare_at_price) > Number(product.price) && (
                  <span className="text-muted line-through">
                    {formatPKR(Number(product.compare_at_price))}
                  </span>
                )}
            </div>

            <div className="gold-rule my-8" />

            <p className="text-cream/80 leading-relaxed">{product.description}</p>

            {product.scent_notes?.length > 0 && (
              <div className="mt-8">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3">
                  Scent Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.scent_notes.map((n) => (
                    <span
                      key={n}
                      className="border border-[var(--border)] px-3 py-1 text-xs text-cream/80"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <AddToCart product={product} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-cream text-center mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
