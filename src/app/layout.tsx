import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Grain } from "@/components/Grain";
import { site } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
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
    <html lang="en-GH" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-leaf focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Grain />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
