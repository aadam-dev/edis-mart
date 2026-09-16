"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Grain } from "@/components/Grain";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOps =
    pathname.startsWith("/admin") || pathname.startsWith("/pos");

  if (isOps) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Grain />
      <div
        className="pointer-events-none fixed inset-0 z-[-1] bg-[url('/brand/bg-botanical.jpg')] bg-cover bg-center opacity-[0.15] mix-blend-multiply"
        aria-hidden="true"
      />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  );
}
