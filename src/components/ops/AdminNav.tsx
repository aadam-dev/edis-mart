"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  ShoppingCart,
  Package,
  Warehouse,
  Truck,
  ChartLine,
  Gear,
  Users,
  Storefront,
  SignOut,
} from "@phosphor-icons/react";
import { BrandLogo } from "@/components/BrandLogo";

const nav = [
  { href: "/admin", label: "Today", icon: House },
  { href: "/pos", label: "Sell", icon: Storefront, external: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/catalogue", label: "Catalogue", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: Warehouse },
  { href: "/admin/purchases", label: "Purchases", icon: Truck },
  { href: "/admin/reports", label: "Reports", icon: ChartLine },
  { href: "/admin/settings", label: "Settings", icon: Gear },
  { href: "/admin/people", label: "People", icon: Users },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/ops/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-full flex-col border-b border-mist bg-forest text-oat md:min-h-dvh md:w-56 md:border-b-0 md:border-r md:border-mist/20">
      <div className="px-4 py-5">
        <div className="inline-flex rounded-lg bg-oat/95 p-2">
          <BrandLogo height={36} priority />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-oat/50">
          Edis Mart ops
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:overflow-visible md:px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href) && item.href !== "/pos";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-oat/15 text-oat"
                  : "text-oat/70 hover:bg-oat/10 hover:text-oat"
              }`}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-oat/10 px-4 py-4">
        <p className="truncate text-xs text-oat/60">{userName}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-oat/70 transition hover:text-oat"
        >
          <SignOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
