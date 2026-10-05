import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zarescents.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/shipping-policy",
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.startsWith("/shop") ? 0.9 : 0.7,
  }));

  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
