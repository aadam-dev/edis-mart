"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/ops/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <p className="label-caps text-sage">Edis Mart ops</p>
      <h1 className="mt-2 font-display text-4xl font-medium text-forest">Sign in</h1>
      <p className="mt-2 text-sm text-forest/60">
        Owner till and back office. Use the admin password from your env.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-forest/80">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-mist bg-white/60 px-4 py-3 text-sm outline-none ring-clay/30 focus:ring-2"
            required
          />
        </label>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-clay px-5 py-3.5 text-sm font-semibold text-oat hover:bg-forest disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Enter ops"}
        </button>
      </form>
    </div>
  );
}
