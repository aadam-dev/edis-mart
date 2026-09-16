import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PeopleForm } from "@/components/ops/PeopleForm";

export default async function AdminPeoplePage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "owner") redirect("/admin");

  const people = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">People</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Accounts
        </h1>
        <p className="mt-2 text-sm text-forest/60">
          v1 till stays owner-only. Manager and till roles are ready for Phase C.
        </p>
      </div>

      <ul className="divide-y divide-mist border border-mist bg-white/40 text-sm">
        {people.map((p) => (
          <li key={p.id} className="flex justify-between px-4 py-3">
            <div>
              <p className="font-medium text-forest">{p.name}</p>
              <p className="text-forest/55">{p.email}</p>
            </div>
            <p className="capitalize text-forest/70">
              {p.role} {p.active ? "" : "(inactive)"}
            </p>
          </li>
        ))}
      </ul>

      <PeopleForm />
    </div>
  );
}
