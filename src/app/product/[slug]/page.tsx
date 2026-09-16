import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/data/catalog";
import { getProductFromDb, getProductsFromDb } from "@/lib/catalog";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductCard } from "@/components/ProductCard";
import { formatGhs, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductFromDb(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductFromDb(slug);
  if (!product) notFound();

  const related = (await getProductsFromDb())
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const offers = product.variants
    .filter((v) => v.retailPrice != null || v.wholesalePrice != null)
    .map((v) => ({
      "@type": "Offer",
      priceCurrency: "GHS",
      price: ((v.retailPrice ?? v.wholesalePrice)! / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${site.url}/product/${product.slug}`,
      name: `${product.name} ${v.size}`,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${site.url}${product.image}`],
    brand: { "@type": "Brand", name: "Yeskoko" },
    offers,
  };

  const fromPrice = product.variants
    .map((v) => v.retailPrice ?? v.wholesalePrice)
    .filter((p): p is number => p != null);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-ink/55">
        <Link href="/shop" className="hover:text-leaf">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductBuyBox product={product} />
        <aside className="space-y-6 lg:pt-4">
          <div className="border border-mist bg-white p-6">
            <h2 className="font-display text-xl font-semibold">Why Yeskoko</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/75">
              <li>No preservatives</li>
              <li>Multiple sizes for home and kitchen</li>
              <li>Made in Ghana. Accra delivery and pickup</li>
              {fromPrice.length > 0 && (
                <li>From {formatGhs(Math.min(...fromPrice))}</li>
              )}
            </ul>
          </div>
          <div className="sticky top-24 border border-mist bg-forest p-6 text-bone">
            <p className="font-display text-2xl font-semibold tracking-tight">
              Texture worth zooming into
            </p>
            <p className="mt-3 text-sm text-bone/75">
              Real flakes and chips. Scroll the pack shot, pick your size, and
              check out with MoMo, card, or cash on delivery.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold">Also in the pantry</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
