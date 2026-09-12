import type { MetadataRoute } from "next";
import { getProducts } from "@/data/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();
  const staticRoutes = [
    "",
    "/shop",
    "/wholesale",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/checkout",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refunds",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
