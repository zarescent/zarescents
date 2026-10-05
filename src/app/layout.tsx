import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { TrackOrderFloat } from "@/components/TrackOrderFloat";
import { CartDrawer } from "@/components/CartDrawer";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zarescents.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zaré Scents | Parfums de Luxe",
    template: "%s | Zaré Scents",
  },
  description:
    "Discover Zaré: luxury long-lasting fragrances crafted for those who leave a lasting impression. Premium perfumes delivered across Pakistan. Cash on delivery.",
  keywords: [
    "Zaré Scents",
    "luxury perfume Pakistan",
    "parfums de luxe",
    "long lasting fragrance",
    "oud perfume",
    "buy perfume online Pakistan",
  ],
  authors: [{ name: "Zaré Scents" }],
  creator: "Zaré Scents",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Zaré Scents",
    title: "Zaré Scents | Parfums de Luxe",
    description:
      "Luxury long-lasting fragrances. Discover your signature scent with Zaré.",
    images: [{ url: "/images/hero-perfect.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaré Scents | Parfums de Luxe",
    description: "Luxury long-lasting fragrances crafted with precision.",
    images: ["/images/hero-perfect.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="texture-bg min-h-full flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <WhatsAppFloat />
        <TrackOrderFloat />
      </body>
    </html>
  );
}
