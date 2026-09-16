"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ops/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Wrong email or password");
        setBusy(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server");
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/brand/bg-botanical.jpg')] bg-cover bg-center opacity-20 mix-blend-multiply"
        aria-hidden
      />
      <div className="relative w-full max-w-md border border-mist/80 bg-oat/95 p-8 shadow-[0_24px_80px_rgba(35,48,31,0.08)] backdrop-blur-sm md:p-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo height={56} priority />
          <p className="label-caps mt-6 text-sage">Edis Mart ops</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-forest md:text-4xl">
            Sign in
          </h1>
          <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-forest/60">
            Till and back office for Yeskoko.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2 text-left">
            <span className="text-sm font-medium text-forest/80">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@edismart.com"
              className="w-full rounded-xl border border-mist bg-white px-4 py-3.5 text-sm text-forest outline-none ring-clay/30 placeholder:text-forest/35 focus:ring-2"
              required
            />
          </label>
          <label className="block space-y-2 text-left">
            <span className="text-sm font-medium text-forest/80">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-mist bg-white px-4 py-3.5 text-sm text-forest outline-none ring-clay/30 focus:ring-2"
              required
            />
          </label>
          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-clay px-5 py-3.5 text-sm font-semibold tracking-wide text-oat transition hover:bg-forest disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Enter ops"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-forest/45">
          <Link href="/" className="underline-offset-2 hover:underline">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
