"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, List, X } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useCart } from "@/store/cart";
import { formatGhs } from "@/lib/site";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/export", label: "Export" },
  { href: "/process", label: "Process" },
  { href: "/sourcing", label: "Sourcing" },
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
  const menuId = useId();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
        <BrandLogo height={44} priority className="md:h-11" />

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring text-sm font-medium tracking-wide transition-colors ${
                  active ? "text-clay" : "text-forest/70 hover:text-forest"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/export"
            className="focus-ring hidden rounded-full bg-forest px-3.5 py-2 text-xs font-semibold tracking-wide text-oat transition hover:bg-clay md:inline-flex"
          >
            For buyers
          </Link>
          <Link
            href="/cart"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-forest/12 px-3.5 py-2 text-sm font-medium text-forest transition hover:border-clay/50"
          >
            <ShoppingBag size={18} weight="regular" />
            <span className="hidden sm:inline">
              {mounted ? formatGhs(subtotal) : "₵0.00"}
            </span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-xs text-oat">
              {mounted ? count : 0}
            </span>
          </Link>

          <button
            type="button"
            className="focus-ring rounded-full border border-forest/12 p-2 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id={menuId}
          className="border-t border-mist/80 bg-oat/95 px-4 py-5 xl:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-base font-medium text-forest hover:bg-mist/60"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/export"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-forest px-4 py-3 text-center text-sm font-semibold text-oat"
            >
              For buyers
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
