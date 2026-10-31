import Link from "next/link";
import { site } from "@/lib/site";

const trade = [
  { href: "/export", label: "Export / trade" },
  { href: "/wholesale", label: "Ghana wholesale" },
  { href: "/process", label: "Process" },
  { href: "/sourcing", label: "Sourcing" },
];

const shop = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const legal = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refunds", label: "Refunds" },
];

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden border-t border-forest/20 bg-forest text-oat">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-12 md:gap-10 md:px-6 md:py-20">
        <div className="md:col-span-5">
          <p className="font-display text-4xl font-medium tracking-tight md:text-5xl">
            Yeskoko
          </p>
          <p className="mt-2 text-sm text-oat/55">by {site.company}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-oat/70">
            Dried fruit snacks from Ghana — coconut flakes, chia coco, mango and
            pineapple chips. Dried and packed for pantries at home and buyers
            abroad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/export"
              className="rounded-full bg-oat px-4 py-2.5 text-sm font-semibold text-forest transition hover:bg-cream"
            >
              Request buyer pack
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-oat/25 px-4 py-2.5 text-sm font-semibold text-oat transition hover:border-oat/50"
            >
              Shop Ghana
            </Link>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="label-caps text-oat/45">Trade</p>
          <ul className="mt-4 space-y-2.5 text-sm text-oat/80">
            {trade.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-oat">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="label-caps text-oat/45">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-oat/80">
            {shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-oat">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="label-caps text-oat/45">Visit</p>
          <ul className="mt-4 space-y-2.5 text-sm text-oat/80">
            <li>
              <a className="transition hover:text-oat" href={`tel:${site.phones[0]}`}>
                {site.phones[0]}
              </a>
            </li>
            <li>
              <a className="transition hover:text-oat" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              {site.hours} · {site.city}, Ghana
            </li>
            <li className="pt-2 text-oat/55">
              {legal.map((l, i) => (
                <span key={l.href}>
                  {i > 0 ? " · " : ""}
                  <Link href={l.href} className="transition hover:text-oat">
                    {l.label}
                  </Link>
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-oat/10 px-4 py-6 md:px-6">
        <p className="text-center text-xs text-oat/45">
          © 2026 {site.company}. Yeskoko snacks. Accra, Ghana. Dried in Ghana.
          Distinct on shelf.
        </p>
        <p
          aria-hidden
          className="pointer-events-none mt-4 select-none text-center font-display text-[clamp(4rem,18vw,14rem)] font-medium leading-none tracking-tight text-oat/[0.06]"
        >
          Yeskoko
        </p>
      </div>
    </footer>
  );
}
