export type CatalogVariant = {
  size: string;
  sku: string;
  retailPrice: number | null;
  wholesalePrice: number | null;
  stock: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  skuBase: string;
  channel: "retail" | "wholesale" | "inquiry";
  featured: boolean;
  sortOrder: number;
  variants: CatalogVariant[];
};

export const catalog: CatalogProduct[] = [
  {
    id: "prod-yeskoko-scf",
    slug: "yeskoko-sweetened-coconut-flakes",
    name: "Yeskoko sweetened coconut flakes",
    tagline: "Soft sweetness, real coconut crunch.",
    description:
      "Snack from the pouch or fold into breakfast. No preservatives. Dried and packed in Ghana.",
    image: "/products/yeskoko.jpg",
    skuBase: "YK-SCF",
    channel: "retail",
    featured: true,
    sortOrder: 1,
    variants: [
      { size: "50g", sku: "YK-SCF-50", retailPrice: 1500, wholesalePrice: 1200, stock: 100 },
      { size: "100g", sku: "YK-SCF-100", retailPrice: 3000, wholesalePrice: 2500, stock: 100 },
      { size: "250g", sku: "YK-SCF-250", retailPrice: 7500, wholesalePrice: 6500, stock: 100 },
      { size: "700g", sku: "YK-SCF-700", retailPrice: 15000, wholesalePrice: 13000, stock: 100 },
    ],
  },
  {
    id: "prod-ucf",
    slug: "unsweetened-coconut-flakes",
    name: "Unsweetened coconut flakes",
    tagline: "Clean coconut for bowls and baking.",
    description:
      "The fruit without the sugar. Ideal for cooking, granola, and everyday snacking.",
    image: "/products/coconut-banner.jpg",
    skuBase: "YK-UCF",
    channel: "retail",
    featured: true,
    sortOrder: 2,
    variants: [
      { size: "250g", sku: "YK-UCF-250", retailPrice: 7500, wholesalePrice: 6500, stock: 100 },
      { size: "700g", sku: "YK-UCF-700", retailPrice: 13000, wholesalePrice: 13000, stock: 100 },
      { size: "1kg", sku: "YK-UCF-1K", retailPrice: null, wholesalePrice: 20000, stock: 100 },
    ],
  },
  {
    id: "prod-mango",
    slug: "mango-chips",
    name: "Mango chips",
    tagline: "Sun-ripened mango, gently dried.",
    description:
      "Tangy, chewy mango chips with no additives. A bright Ghana snack from 100g to 1kg.",
    image: "/products/mango.jpg",
    skuBase: "YK-MC",
    channel: "retail",
    featured: true,
    sortOrder: 3,
    variants: [
      { size: "100g", sku: "YK-MC-100", retailPrice: 3500, wholesalePrice: null, stock: 100 },
      { size: "1kg", sku: "YK-MC-1K", retailPrice: 35000, wholesalePrice: null, stock: 100 },
    ],
  },
  {
    id: "prod-ccc",
    slug: "chia-chia-coco",
    name: "Chia chia coco",
    tagline: "Wholesale coconut blend for kitchens that buy by the kilo.",
    description:
      "Built for retailers and food service. Message us for volume pricing and delivery.",
    image: "/products/chia.jpg",
    skuBase: "YK-CCC",
    channel: "wholesale",
    featured: false,
    sortOrder: 4,
    variants: [
      { size: "100g", sku: "YK-CCC-100", retailPrice: null, wholesalePrice: 4000, stock: 100 },
      { size: "250g", sku: "YK-CCC-250", retailPrice: null, wholesalePrice: 10000, stock: 100 },
      { size: "700g", sku: "YK-CCC-700", retailPrice: null, wholesalePrice: 17000, stock: 100 },
      { size: "1kg", sku: "YK-CCC-1K", retailPrice: null, wholesalePrice: 25000, stock: 100 },
    ],
  },
  {
    id: "prod-pineapple",
    slug: "pineapple-chips",
    name: "Pineapple chips",
    tagline: "Sweet-tangy chips from real pineapple.",
    description:
      "Packaging is ready. Tell us the size you need and we will quote a batch.",
    image: "/products/coconut-banner.jpg",
    skuBase: "YK-PC",
    channel: "inquiry",
    featured: false,
    sortOrder: 5,
    variants: [
      { size: "250g", sku: "YK-PC-250", retailPrice: null, wholesalePrice: null, stock: 0 },
      { size: "700g", sku: "YK-PC-700", retailPrice: null, wholesalePrice: null, stock: 0 },
    ],
  },
];

export function getProducts() {
  return [...catalog].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProducts() {
  return getProducts().filter((p) => p.featured);
}

export function getProduct(slug: string) {
  return catalog.find((p) => p.slug === slug) ?? null;
}

export function getVariantBySku(sku: string) {
  for (const product of catalog) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return null;
}
