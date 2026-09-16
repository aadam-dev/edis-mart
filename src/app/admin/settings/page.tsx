import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/ops/SettingsForm";

export default async function AdminSettingsPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">Settings</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Shop ops config
        </h1>
      </div>
      <SettingsForm
        initial={{
          whatsapp: map.whatsapp || "",
          shipping_accra: map.shipping_accra || "2500",
          pickup_address: map.pickup_address || "",
          momo_note: map.momo_note || "",
        }}
      />
      <div className="border border-mist bg-white/40 p-5 text-sm text-forest/70">
        <p className="font-medium text-forest">Paystack keys</p>
        <p className="mt-2">
          Public key:{" "}
          {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.startsWith("pk_")
            ? "configured"
            : "missing"}
        </p>
        <p>
          Secret key:{" "}
          {process.env.PAYSTACK_SECRET_KEY &&
          !process.env.PAYSTACK_SECRET_KEY.includes("replace")
            ? "configured"
            : "missing / dev mode"}
        </p>
      </div>
    </div>
  );
}
