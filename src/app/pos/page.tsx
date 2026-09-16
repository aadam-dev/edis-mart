import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { PosTill } from "@/components/ops/PosTill";

export default async function PosPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  return <PosTill userName={user.name} />;
}
