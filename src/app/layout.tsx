import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { StorefrontShell } from "@/components/StorefrontShell";
import { absoluteUrl, site } from "@/lib/site";
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
    default: "Yeskoko — Ghanaian dried fruit snacks | Edis Mart",
    template: "%s | Yeskoko by Edis Mart",
  },
  description:
    "Yeskoko by Edis Mart: coconut flakes, chia coco, mango and pineapple chips dried in Ghana. Shop retail in Ghana or request an export buyer pack.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Yeskoko by Edis Mart",
    description: "Dried in Ghana. Distinct on shelf.",
    url: site.url,
    siteName: "Yeskoko",
    locale: "en_GH",
    type: "website",
    images: [{ url: "/film/ghana/04-family/poster.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeskoko by Edis Mart",
    description: "Dried fruit snacks from Ghana.",
    images: ["/film/ghana/04-family/poster.jpg"],
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-oat"
        >
          Skip to content
        </a>
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
