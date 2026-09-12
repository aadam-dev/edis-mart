export const site = {
  name: "Yeskoko",
  company: "Edis Mart",
  domain: "edismartgh.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "edismart777@gmail.com",
  phones: ["+233549092316", "+233543358778"],
  whatsapp: process.env.WHATSAPP_NUMBER || "233549092316",
  hours: "8:30 - 17:30",
  hoursSchema: "Mo-Fr 08:30-17:30",
  city: "Accra",
  country: "GH",
  shippingAccraPesewas: Number(process.env.SHIPPING_ACCRA_FEE_PESEWAS || 2500),
};

export function formatGhs(pesewas: number | null | undefined) {
  if (pesewas == null) return "Quote";
  return `₵${(pesewas / 100).toFixed(2)}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
