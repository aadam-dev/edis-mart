import { redirect } from "next/navigation";
import Image from "next/image";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { CatalogueControls } from "@/components/ops/CatalogueControls";

export default async function AdminCataloguePage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">Catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Products & sizes
        </h1>
      </div>
      <div className="space-y-6">
        {products.map((p) => (
          <article key={p.id} className="border border-mist bg-white/40 p-5">
            <div className="flex flex-wrap gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-mist">
                <Image src={p.image} alt="" fill className="object-cover" sizes="80px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-forest">{p.name}</h2>
                    <p className="text-sm text-forest/55">
                      {p.channel} · {p.slug}
                    </p>
                  </div>
                  <CatalogueControls productId={p.id} visible={p.visible} />
                </div>
                <ul className="mt-4 divide-y divide-mist/80 text-sm">
                  {p.variants.map((v) => (
                    <li key={v.id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span>
                        {v.size} · <span className="tabular-nums text-forest/55">{v.sku}</span>
                      </span>
                      <span className="tabular-nums">
                        retail {v.retailPrice != null ? formatGhs(v.retailPrice) : "—"} · wholesale{" "}
                        {v.wholesalePrice != null ? formatGhs(v.wholesalePrice) : "—"} · stock{" "}
                        {v.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
