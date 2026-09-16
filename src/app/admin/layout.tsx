import { AdminNav } from "@/components/ops/AdminNav";
import { OpsCredit } from "@/components/ops/OpsCredit";
import { requireOpsUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOpsUser();

  if (!user) {
    return <div className="min-h-dvh bg-oat">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-oat md:flex-row">
      <AdminNav userName={user.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</div>
        <footer className="border-t border-mist px-4 py-4 md:px-8">
          <OpsCredit />
        </footer>
      </div>
    </div>
  );
}
