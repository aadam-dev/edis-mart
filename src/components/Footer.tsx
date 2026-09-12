import Link from "next/link";
import { site } from "@/lib/site";

const legal = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden border-t border-mist/70 bg-forest text-oat">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-3 md:gap-10 md:px-6 md:py-20">
        <div>
          <p className="font-display text-4xl font-medium tracking-tight md:text-5xl">
            Yeskoko
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-oat/65">
            Dried fruit snacks by {site.company}. Real coconut crunch, made in
            Ghana.
          </p>
        </div>
        <div>
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
              Available {site.hours} - {site.city}
            </li>
          </ul>
        </div>
        <div>
          <p className="label-caps text-oat/45">Explore</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-oat/80">
            <li>
              <Link href="/shop" className="transition hover:text-oat">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/wholesale" className="transition hover:text-oat">
                Wholesale
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-oat">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-oat">
                Contact
              </Link>
            </li>
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-oat">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-oat/10 px-4 py-6 md:px-6">
        <p className="text-center text-xs text-oat/45">
          © 2026 {site.company}. Yeskoko snacks. Accra, Ghana.
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
