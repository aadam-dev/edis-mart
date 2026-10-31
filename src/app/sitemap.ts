import type { MetadataRoute } from "next";
import { getProducts } from "@/data/catalog";
import { site } from "@/lib/site";

const CONTENT_UPDATED = new Date("2026-04-09");

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/export", priority: 0.95 },
    { path: "/wholesale", priority: 0.7 },
    { path: "/process", priority: 0.7 },
    { path: "/sourcing", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/faq", priority: 0.5 },
    { path: "/legal/privacy", priority: 0.2 },
    { path: "/legal/terms", priority: 0.2 },
    { path: "/legal/refunds", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...products.map((p) => ({
      url: `${site.url}/product/${p.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
