import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

const schema = z.object({
  organization: z.string().trim().min(2).max(200),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  targetMarket: z.string().trim().min(2).max(200),
  products: z.array(z.string()).max(12).default([]),
  volumeBand: z.string().trim().min(1).max(120),
  privateLabel: z.boolean().optional().default(false),
  certificationNeeds: z.string().trim().max(2000).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete required fields and consent." },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const inquiry = await prisma.tradeInquiry.create({
      data: {
        organization: data.organization,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        targetMarket: data.targetMarket,
        productsJson: JSON.stringify(data.products),
        volumeBand: data.volumeBand,
        privateLabel: data.privateLabel,
        certificationNeeds: data.certificationNeeds || null,
        notes: data.notes || null,
        consent: true,
        status: "new",
      },
    });

    await prisma.auditEvent.create({
      data: {
        action: "trade_inquiry.create",
        entityType: "TradeInquiry",
        entityId: inquiry.id,
        metadata: JSON.stringify({ email: data.email, market: data.targetMarket }),
      },
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("trade-inquiry", err);
    return NextResponse.json(
      { error: "Could not save inquiry. Email edismart777@gmail.com." },
      { status: 500 },
    );
  }
}
