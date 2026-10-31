/**
 * Idempotent import of September 2024 Yeskoko / Edis Mart baseline.
 * Usage:
 *   npx tsx scripts/import-business-assessment.ts           # dry-run
 *   npx tsx scripts/import-business-assessment.ts --apply
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const apply = process.argv.includes("--apply");
const SOURCE_DATE = new Date("2024-09-01");
const prisma = new PrismaClient();

type PartnerSeed = {
  sourceKey: string;
  kind: string;
  name: string;
  location?: string;
  relationshipMonths?: number;
  notes?: string;
  offerings?: { category: string; itemName: string }[];
};

const retailers: PartnerSeed[] = [
  { sourceKey: "retailer:ashieyie-goil-mart:ashieyie", kind: "retailer", name: "Ashieyie Goil Mart", location: "Ashieyie", relationshipMonths: 18 },
  { sourceKey: "retailer:pat-store:adenta-frafraha", kind: "retailer", name: "Pat Store", location: "Adenta Frafraha", relationshipMonths: 24 },
  { sourceKey: "retailer:go-cafe-goil-mart:upsa", kind: "retailer", name: "Go Café Goil Mart", location: "UPSA", relationshipMonths: 16 },
  { sourceKey: "retailer:migtown:accra", kind: "retailer", name: "Migtown", location: "Accra", relationshipMonths: 12 },
  { sourceKey: "retailer:unity-college:adenta-frafraha", kind: "retailer", name: "Unity College", location: "Adenta Frafraha", relationshipMonths: 12 },
  { sourceKey: "retailer:abokobi-store:unknown", kind: "retailer", name: "Abokobi Store", location: undefined, relationshipMonths: 6, notes: "Location missing in source sheet" },
  { sourceKey: "retailer:iryan-health-shop:madina", kind: "retailer", name: "Iryan Health Shop", location: "Madina", relationshipMonths: 3 },
  { sourceKey: "retailer:ikram-ham-enterprise:tamale", kind: "retailer", name: "Ikram-Ham Enterprise", location: "Tamale", relationshipMonths: 2 },
  { sourceKey: "retailer:mikki-mart:tamale", kind: "retailer", name: "Mikki Mart", location: "Tamale", relationshipMonths: 6 },
  { sourceKey: "retailer:goil-mart-opposite-melcom:tamale", kind: "retailer", name: "Goil Mart opposite Melcom", location: "Tamale", relationshipMonths: 12 },
  { sourceKey: "retailer:defountain-supermarket:cape-coast", kind: "retailer", name: "Defountain SuperMarket", location: "Cape Coast", relationshipMonths: 18 },
  { sourceKey: "retailer:central-for-national-culture:cape-coast", kind: "retailer", name: "Central for National Culture", location: "Cape Coast", relationshipMonths: 18 },
  { sourceKey: "retailer:blessing-supermarket:cape-coast", kind: "retailer", name: "Blessing Supermarket", location: "Cape Coast", relationshipMonths: 12 },
  { sourceKey: "retailer:abura-supermarket:cape-coast", kind: "retailer", name: "Abura Supermarket", location: "Cape Coast", relationshipMonths: 24 },
  { sourceKey: "retailer:tathar-pharmacy:ho", kind: "retailer", name: "Tathar Pharmacy", location: "Ho", relationshipMonths: 8 },
];

const agents: PartnerSeed[] = [
  { sourceKey: "agent:mary:pentecost-university", kind: "sales_agent", name: "Mary", location: "Pentecost University", relationshipMonths: 18 },
  { sourceKey: "agent:ella:university-of-ghana", kind: "sales_agent", name: "Ella", location: "University of Ghana", relationshipMonths: 12 },
  { sourceKey: "agent:dominic:adenta", kind: "sales_agent", name: "Dominic", location: "Adenta", relationshipMonths: 24 },
  { sourceKey: "agent:elizabeth:tesano", kind: "sales_agent", name: "Elizabeth", location: "Tesano", relationshipMonths: 8 },
  { sourceKey: "agent:roselyn:airport", kind: "sales_agent", name: "Roselyn", location: "Airport", relationshipMonths: 6 },
  { sourceKey: "agent:khalifa:adenta", kind: "sales_agent", name: "Khalifa", location: "Adenta", relationshipMonths: 2 },
];

const suppliers: PartnerSeed[] = [
  { sourceKey: "supplier:farmer-shadrack:coconut", kind: "supplier", name: "Farmer Shadrack", offerings: [{ category: "produce", itemName: "Coconut" }] },
  { sourceKey: "supplier:comfort:mango-pineapple", kind: "supplier", name: "Comfort", offerings: [{ category: "produce", itemName: "Mango/pineapple" }] },
  { sourceKey: "supplier:hellen:chia-sesame", kind: "supplier", name: "Hellen", offerings: [{ category: "produce", itemName: "Chia/sesame seed" }] },
  { sourceKey: "supplier:marymag-enterprise:ginger", kind: "supplier", name: "Marymag Enterprise", offerings: [{ category: "produce", itemName: "Ginger" }] },
  { sourceKey: "supplier:madam-beauty:honey", kind: "supplier", name: "Madam Beauty", offerings: [{ category: "produce", itemName: "Honey" }] },
  { sourceKey: "supplier:konko-hemaa:pouches", kind: "supplier", name: "Konko Hemaa", offerings: [{ category: "packaging", itemName: "Pouches" }] },
  { sourceKey: "supplier:package-rack:pouches", kind: "supplier", name: "Package Rack", offerings: [{ category: "packaging", itemName: "Pouches" }] },
  { sourceKey: "supplier:pouch-haven:pouches", kind: "supplier", name: "Pouch Haven", offerings: [{ category: "packaging", itemName: "Pouches" }] },
  { sourceKey: "supplier:young-prince:labels", kind: "supplier", name: "Young Prince", offerings: [{ category: "packaging", itemName: "Labels" }] },
];

const equipment = [
  { name: "50kg dehydrator", capacity: "50kg", status: "in_use", notes: "Assessment baseline — capacity constraint noted" },
  { name: "Packaging machine", capacity: null, status: "in_use", notes: "Nitrogen packaging capability referenced" },
  { name: "Manual slicers", capacity: null, status: "needs_repair", notes: "Malfunctioning slicer noted in assessment" },
  { name: "Industrial slicer", capacity: null, status: "planned", notes: "Recommended investment" },
  { name: "1000kg dehydrator", capacity: "1000kg", status: "planned", notes: "Recommended investment" },
];

const compliance = [
  { kind: "fda", title: "Ghana FDA documentation", status: "documented", authority: "Ghana FDA" },
  { kind: "registration", title: "Registrar of Companies registration", status: "documented", authority: "Registrar of Companies" },
  { kind: "certification", title: "GSA certification", status: "roadmap", authority: "GSA", ownerNote: "Needed for exports — not current" },
  { kind: "sop", title: "Formal production SOPs", status: "roadmap", authority: "Internal" },
  { kind: "sop", title: "Dedicated QC officer role", status: "roadmap", authority: "Internal" },
];

const baselines = [
  {
    sourceKey: "baseline:monthly-sales-ghs-2024-09",
    label: "Average monthly sales (GHS)",
    valueJson: JSON.stringify({ amountGhs: 20000, currency: "GHS" }),
    notes: "Needs Assessment Report Sep 2024 — not live KPI",
  },
  {
    sourceKey: "baseline:gross-margin-2024-09",
    label: "Approximate gross margin",
    valueJson: JSON.stringify({ marginPct: 40 }),
    notes: "Assessment baseline — verify before using in reports as current",
  },
  {
    sourceKey: "baseline:sales-mix-2024-09",
    label: "Sales channel mix",
    valueJson: JSON.stringify({ exhibitionsPct: 60, socialPct: 10 }),
    notes: "Exhibitions dominant in 2024 assessment",
  },
];

function startedFromMonths(months?: number) {
  if (!months) return null;
  const d = new Date(SOURCE_DATE);
  d.setMonth(d.getMonth() - months);
  return d;
}

async function upsertPartner(seed: PartnerSeed) {
  const data = {
    kind: seed.kind,
    name: seed.name,
    location: seed.location ?? null,
    relationshipMonths: seed.relationshipMonths ?? null,
    relationshipStartedAt: startedFromMonths(seed.relationshipMonths),
    notes: seed.notes ?? null,
    sourceDate: SOURCE_DATE,
    verificationStatus: "needs_verification",
    status: "active",
  };
  if (!apply) return { action: "would_upsert", sourceKey: seed.sourceKey };
  const partner = await prisma.partner.upsert({
    where: { sourceKey: seed.sourceKey },
    create: { sourceKey: seed.sourceKey, ...data },
    update: data,
  });
  if (seed.offerings?.length) {
    for (const o of seed.offerings) {
      const existing = await prisma.supplierOffering.findFirst({
        where: { partnerId: partner.id, itemName: o.itemName, category: o.category },
      });
      if (!existing) {
        await prisma.supplierOffering.create({
          data: {
            partnerId: partner.id,
            category: o.category,
            itemName: o.itemName,
            active: true,
          },
        });
      }
    }
  }
  if (seed.kind === "retailer") {
    await prisma.retailerAccount.upsert({
      where: { partnerId: partner.id },
      create: { partnerId: partner.id },
      update: {},
    });
  }
  return { action: "upserted", sourceKey: seed.sourceKey };
}

async function main() {
  console.log(apply ? "APPLY mode" : "DRY-RUN mode (pass --apply to write)");
  const all = [...retailers, ...agents, ...suppliers];
  const results = [];
  for (const p of all) results.push(await upsertPartner(p));

  if (apply) {
    for (const e of equipment) {
      const existing = await prisma.equipmentAsset.findFirst({ where: { name: e.name } });
      if (existing) {
        await prisma.equipmentAsset.update({
          where: { id: existing.id },
          data: {
            capacity: e.capacity,
            status: e.status,
            notes: e.notes,
            sourceDate: SOURCE_DATE,
            verificationStatus: "needs_verification",
          },
        });
      } else {
        await prisma.equipmentAsset.create({
          data: {
            ...e,
            sourceDate: SOURCE_DATE,
            verificationStatus: "needs_verification",
          },
        });
      }
    }
    for (const c of compliance) {
      const existing = await prisma.complianceItem.findFirst({
        where: { title: c.title, kind: c.kind },
      });
      if (existing) {
        await prisma.complianceItem.update({
          where: { id: existing.id },
          data: {
            status: c.status,
            authority: c.authority,
            ownerNote: "ownerNote" in c ? (c as { ownerNote?: string }).ownerNote : null,
            sourceDate: SOURCE_DATE,
            verificationStatus: "needs_verification",
          },
        });
      } else {
        await prisma.complianceItem.create({
          data: {
            kind: c.kind,
            title: c.title,
            authority: c.authority,
            status: c.status,
            ownerNote: "ownerNote" in c ? (c as { ownerNote?: string }).ownerNote : null,
            sourceDate: SOURCE_DATE,
            verificationStatus: "needs_verification",
          },
        });
      }
    }
    for (const b of baselines) {
      await prisma.businessBaseline.upsert({
        where: { sourceKey: b.sourceKey },
        create: {
          ...b,
          sourceDate: SOURCE_DATE,
          verificationStatus: "needs_verification",
        },
        update: {
          label: b.label,
          valueJson: b.valueJson,
          notes: b.notes,
          sourceDate: SOURCE_DATE,
          verificationStatus: "needs_verification",
        },
      });
    }
    await prisma.auditEvent.create({
      data: {
        action: "import.business_assessment",
        metadata: JSON.stringify({
          sourceDate: SOURCE_DATE.toISOString(),
          partners: all.length,
          apply: true,
        }),
      },
    });
  }

  console.log({
    partners: results.length,
    retailers: retailers.length,
    agents: agents.length,
    suppliers: suppliers.length,
    equipment: equipment.length,
    compliance: compliance.length,
    baselines: baselines.length,
    sample: results.slice(0, 3),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
