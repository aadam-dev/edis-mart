"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk(false);
    const res = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed");
      return;
    }
    setName("");
    setPhone("");
    setOk(true);
    router.refresh();
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-lg space-y-3 border border-mist bg-white/40 p-5"
    >
      <h2 className="font-display text-2xl text-forest">Add customer</h2>
      <input
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      />
      <input
        required
        placeholder="Phone (e.g. 0549092316)"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5 text-sm"
      />
      {error && <p className="text-sm text-clay">{error}</p>}
      {ok && !error && (
        <p className="text-sm text-forest/60">Saved to customer book</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-oat disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save customer"}
      </button>
    </form>
  );
}
