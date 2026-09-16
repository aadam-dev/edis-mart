import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { StorefrontShell } from "@/components/StorefrontShell";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Yeskoko coconut flakes in Ghana | Edis Mart",
    template: "%s | Yeskoko by Edis Mart",
  },
  description:
    "Shop Yeskoko coconut flakes and mango chips dried in Ghana. No preservatives. Pay with MoMo, card, or cash on delivery.",
  openGraph: {
    title: "Yeskoko by Edis Mart",
    description:
      "Coconut that still tastes like fruit. Dried snacks made in Ghana.",
    url: site.url,
    siteName: "Yeskoko",
    locale: "en_GH",
    type: "website",
    images: [{ url: "/products/yeskoko.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-clay focus:px-4 focus:py-2 focus:text-oat"
        >
          Skip to content
        </a>
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
