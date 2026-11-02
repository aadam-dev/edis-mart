/** Verified public claims — keep in sync with docs/11-export-rebrand.md */

export const brandVoice = {
  exportLine: "Dried in Ghana. Distinct on shelf.",
  domesticLine: "Coconut that still tastes like fruit.",
  promise: "Ghanaian fruit, clearly made and clearly documented.",
} as const;

export const processSteps = [
  {
    title: "Dehusk & peel",
    body: "Skins and husks removed with care.",
  },
  {
    title: "Slice",
    body: "Uniform cuts for even drying.",
  },
  {
    title: "Wash",
    body: "Rinsed clean before heat.",
  },
  {
    title: "Steam / blanch",
    body: "Readied for dehydration.",
  },
  {
    title: "Dehydrate",
    body: "Dried in Accra, no preservatives.",
  },
  {
    title: "Nitrogen-flush pack",
    body: "Sealed so the crunch lasts.",
  },
] as const;

export const qualityMatrix = [
  {
    status: "Documented",
    title: "Ghana FDA documentation",
    body: "Facility and product documentation under Ghana FDA. Exact certificates ship with the buyer pack on request.",
  },
  {
    status: "Documented",
    title: "Registrar of Companies",
    body: "Edis Mart, the Ghanaian company behind Yeskoko.",
  },
  {
    status: "On shelves",
    title: "Accra, Tamale, Cape Coast, Ho",
    body: "Sold through Ghana retail partners.",
  },
  {
    status: "In progress",
    title: "GSA certification",
    body: "Listed here as current once the certificate is issued.",
  },
] as const;

export const buyerRouteSteps = [
  {
    title: "Request the buyer pack",
    body: "Products, formats, documentation status.",
  },
  {
    title: "Samples and documents",
    body: "Sample set and copies of what we hold.",
  },
  {
    title: "Formats and volumes",
    body: "Pouch sizes, carton counts, and packing enquiries.",
  },
  {
    title: "First order",
    body: "Lead times confirmed in writing once volumes are clear.",
  },
] as const;

/**
 * Four fruit fields for the homepage (docs/13).
 * Claim-safe: no health, nutrition, or certification invention.
 * Interim pack JPGs — replace before launch (docs/13 §1.7).
 */
export const fruitStories = [
  {
    id: "coconut",
    eyebrow: "01 / 04 · Coconut",
    giant: "Coconut",
    hook: "Flakes that still taste like the nut.",
    line: "Shaved thin and dried to a clean snap. Sweetened for the snack bowl, unsweetened for the kitchen.",
    spec: "Sweetened & unsweetened · retail pouch · trade sizes on request",
    cta: "See coconut flakes",
    field: "field-coconut" as const,
    ink: "oat" as const,
    image: "/products/yeskoko.jpg",
    imageAlt: "Yeskoko sweetened coconut flakes pack",
    productHref: "/product/yeskoko-sweetened-coconut-flakes",
    inquiryProduct: "Sweetened coconut flakes",
    mixSlug: "yeskoko-sweetened-coconut-flakes",
    mixSize: "100g",
    mixSku: "YK-SCF-100",
  },
  {
    id: "chia",
    eyebrow: "02 / 04 · Chia coco",
    giant: "Chia coco",
    hook: "Coconut with a seed crunch.",
    line: "Coconut, chia, sesame, cinnamon, date and honey, dried together into a denser chew.",
    spec: "Blend · retail pouch",
    cta: "See chia coco",
    field: "field-chia" as const,
    ink: "oat" as const,
    image: "/products/chia.jpg",
    imageAlt: "Yeskoko chia coco pack",
    productHref: "/product/chia-chia-coco",
    inquiryProduct: "Chia coco",
    mixSlug: "chia-chia-coco",
    mixSize: "100g",
    mixSku: "YK-CCC-100",
  },
  {
    id: "mango",
    eyebrow: "03 / 04 · Mango",
    giant: "Mango",
    hook: "Ripe mango, dried to a slow chew.",
    line: "Cut from ripe fruit and dried until the tang concentrates.",
    spec: "Mango chips · retail pouch",
    cta: "See mango chips",
    field: "field-mango" as const,
    ink: "forest" as const,
    image: "/products/mango.jpg",
    imageAlt: "Yeskoko mango chips pack",
    productHref: "/product/mango-chips",
    inquiryProduct: "Mango chips",
    mixSlug: "mango-chips",
    mixSize: "100g",
    mixSku: "YK-MC-100",
  },
  {
    id: "pineapple",
    eyebrow: "04 / 04 · Pineapple",
    giant: "Pineapple",
    hook: "Pineapple you can hear.",
    line: "Rings dried until the edges toast and the centre stays bright.",
    spec: "Pineapple chips · retail pouch",
    cta: "See pineapple chips",
    field: "field-pineapple" as const,
    ink: "oat" as const,
    image: "/products/pineapple.jpg",
    imageAlt: "Yeskoko pineapple chips pack",
    productHref: "/product/pineapple-chips",
    inquiryProduct: "Pineapple chips",
    mixSlug: "pineapple-chips",
    mixSize: "100g",
    mixSku: "YK-PC-100",
  },
] as const;

export type FruitStory = (typeof fruitStories)[number];

export const faqs = [
  {
    q: "Where are Yeskoko snacks made?",
    a: "Dried and packed in Accra, Ghana by Edis Mart — a female-led food processor founded in 2015 that moved into dried foods in 2020.",
  },
  {
    q: "Do you use preservatives?",
    a: "No. Our dried coconut flakes and fruit chips are made without preservatives. Always check the pack label for ingredients on each SKU.",
  },
  {
    q: "Can importers request samples or a buyer pack?",
    a: "Yes. Use the Export page to request a buyer pack with products of interest, target market, and volume band. We reply with documentation status and next steps.",
  },
  {
    q: "Are you export-certified?",
    a: "We hold Ghana FDA documentation and company registration. Additional export certifications such as GSA are on our roadmap and are not claimed as current until documents are issued.",
  },
  {
    q: "How do Ghana shoppers pay?",
    a: "Online orders accept Paystack (card / MoMo) or cash on delivery where offered. WhatsApp orders are welcome for Accra and partner cities.",
  },
  {
    q: "Do you sell wholesale in Ghana?",
    a: "Yes — retailers and kitchens can request domestic wholesale pricing via the Wholesale page or WhatsApp.",
  },
] as const;
