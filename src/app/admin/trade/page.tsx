import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { TradeStatusForm } from "@/components/ops/TradeStatusForm";

export default async function AdminTradePage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (!can(user, "trade.manage")) redirect("/admin");

  const inquiries = await prisma.tradeInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Trade</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Buyer pack inquiries
        </h1>
      </div>
      <ul className="space-y-4">
        {inquiries.length === 0 && (
          <li className="text-sm text-forest/55">No trade inquiries yet.</li>
        )}
        {inquiries.map((inq) => {
          const products = JSON.parse(inq.productsJson || "[]") as string[];
          return (
            <li key={inq.id} className="border border-mist bg-white/40 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-forest">
                    {inq.organization} · {inq.contactName}
                  </p>
                  <p className="text-forest/55">
                    {inq.email}
                    {inq.phone ? ` · ${inq.phone}` : ""}
                  </p>
                  <p className="mt-2 text-forest/70">
                    Market: {inq.targetMarket} · Volume: {inq.volumeBand}
                    {inq.privateLabel ? " · Private label interest" : ""}
                  </p>
                  {products.length > 0 && (
                    <p className="mt-1 text-xs text-forest/50">
                      {products.join(" · ")}
                    </p>
                  )}
                  {inq.notes && (
                    <p className="mt-2 text-forest/60">{inq.notes}</p>
                  )}
                  <p className="mt-2 text-xs text-forest/40">
                    {new Date(inq.createdAt).toLocaleString("en-GH")}
                  </p>
                </div>
                <TradeStatusForm id={inq.id} status={inq.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
