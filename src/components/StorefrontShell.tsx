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
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(111,135,72,0.35), transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(181,92,59,0.22), transparent 45%), url('/brand/bg-botanical.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
