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
    <footer className="mt-auto border-t border-mist bg-forest text-bone">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            Yeskoko
          </p>
          <p className="mt-2 max-w-sm text-sm text-bone/75">
            Dried fruit snacks by {site.company}. Real coconut crunch, made in
            Ghana.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-bone/60">
            Visit
          </p>
          <ul className="mt-3 space-y-2 text-sm text-bone/85">
            <li>
              <a className="hover:text-white" href={`tel:${site.phones[0]}`}>
                {site.phones[0]}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              Available {site.hours} - {site.city}
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-bone/60">
            Explore
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/wholesale" className="hover:text-white">
                Wholesale
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-bone/55 md:px-6">
        © 2026 {site.company}. Yeskoko snacks. Accra, Ghana.
      </div>
    </footer>
  );
}
