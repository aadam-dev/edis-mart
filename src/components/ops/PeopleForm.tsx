"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PeopleForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk(false);
    const res = await fetch("/api/admin/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setOk(true);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-lg space-y-3 border border-mist bg-white/40 p-5">
      <h2 className="font-display text-2xl text-forest">Add person</h2>
      <input
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      >
        <option value="manager">Manager</option>
        <option value="till">Till only</option>
        <option value="owner">Owner</option>
      </select>
      {error && <p className="text-sm text-clay">{error}</p>}
      {ok && !error && (
        <p className="text-sm text-forest/60">Person created</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-oat"
      >
        Create
      </button>
    </form>
  );
}
