/** Verified public claims — keep in sync with docs/11-export-rebrand.md */

export const brandVoice = {
  exportLine: "Dried in Ghana. Distinct on shelf.",
  domesticLine: "Coconut that still tastes like fruit.",
  promise: "Ghanaian fruit, clearly made and clearly documented.",
} as const;

export const processSteps = [
  {
    title: "Dehusk & peel",
    body: "Coconut and fruit prepared for clean drying — skins and husks removed with care.",
  },
  {
    title: "Slice",
    body: "Uniform cuts so trays dry evenly and packs stay consistent.",
  },
  {
    title: "Wash",
    body: "Rinsed clean before heat — hygiene before flavour.",
  },
  {
    title: "Steam / blanch",
    body: "A controlled pass that readies fruit for dehydration.",
  },
  {
    title: "Dehydrate",
    body: "Dried in Accra without preservatives — texture first.",
  },
  {
    title: "Nitrogen-flush pack",
    body: "Sealed for the shelf so the crunch lasts in the pouch.",
  },
] as const;

export const qualityMatrix = [
  {
    status: "Documented",
    title: "Ghana FDA documentation",
    body: "Facility and product documentation under Ghana FDA. Exact certificates available in the buyer pack on request.",
  },
  {
    status: "Documented",
    title: "Registrar of Companies",
    body: "Edis Mart is a registered Ghanaian company behind the Yeskoko brand.",
  },
  {
    status: "Market proof",
    title: "Ghana retail reach",
    body: "Sold through retail partners across Accra, Tamale, Cape Coast, and Ho.",
  },
  {
    status: "Roadmap",
    title: "GSA & export certifications",
    body: "Additional export certifications are in progress. We do not claim GSA or foreign approvals until documents are current.",
  },
] as const;

export const productWorlds = [
  {
    slug: "yeskoko-sweetened-coconut-flakes",
    name: "Sweetened coconut flakes",
    eyebrow: "Coconut",
    blurb: "Soft sweetness, real coconut crunch — the Yeskoko signature snack.",
    image: "/products/worlds/coconut.jpg",
    tone: "from-[#173b2a]/[0.08]",
  },
  {
    slug: "chia-chia-coco",
    name: "Chia coco",
    eyebrow: "Blend",
    blurb: "Coconut with chia, sesame, cinnamon, date, and honey.",
    image: "/products/worlds/chia.jpg",
    tone: "from-[#b55c3b]/[0.10]",
  },
  {
    slug: "mango-chips",
    name: "Mango chips",
    eyebrow: "Mango",
    blurb: "Tangy, chewy chips from ripe mango — no additives.",
    image: "/products/worlds/mango.jpg",
    tone: "from-[#e0a128]/[0.14]",
  },
  {
    slug: "pineapple-chips",
    name: "Pineapple chips",
    eyebrow: "Pineapple",
    blurb: "Bright, sweet-tangy chips dried for the Ghana pantry.",
    image: "/products/worlds/pineapple.jpg",
    tone: "from-[#6f8748]/[0.12]",
  },
] as const;

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
