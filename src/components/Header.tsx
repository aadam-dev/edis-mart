"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, List, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { formatGhs } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-mist/80 bg-bone/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2">
          <Image
            src="/brand/logo.jpg"
            alt="Yeskoko"
            width={140}
            height={44}
            className="h-9 w-auto object-contain md:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring text-sm font-semibold tracking-wide transition-colors ${
                  active ? "text-leaf" : "text-ink/80 hover:text-leaf"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-leaf"
          >
            <ShoppingBag size={18} weight="bold" />
            <span className="hidden sm:inline">
              {mounted ? formatGhs(subtotal) : "₵0.00"}
            </span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf px-1 text-xs text-white">
              {mounted ? count : 0}
            </span>
          </Link>

          <button
            type="button"
            className="focus-ring rounded-full border border-forest/15 p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-mist bg-bone px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-base font-semibold text-ink hover:bg-mist"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-leaf px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Shop the flakes
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
