"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const products = [
  "Sweetened coconut flakes",
  "Unsweetened coconut flakes",
  "Chia coco",
  "Mango chips",
  "Pineapple chips",
  "Private label / contract pack",
] as const;

const volumes = [
  "Exploring / samples",
  "Under 500 kg / quarter",
  "500 kg – 2 tonnes / quarter",
  "2+ tonnes / quarter",
  "Not sure yet",
] as const;

function parsePrefill(raw: string | null): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function TradeInquiryForm() {
  const searchParams = useSearchParams();
  const prefill = useMemo(
    () => parsePrefill(searchParams.get("products")),
    [searchParams],
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      organization: String(data.get("organization") || ""),
      contactName: String(data.get("contactName") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      targetMarket: String(data.get("targetMarket") || ""),
      products: data.getAll("products").map(String),
      volumeBand: String(data.get("volumeBand") || ""),
      privateLabel: data.get("privateLabel") === "on",
      certificationNeeds: String(data.get("certificationNeeds") || ""),
      notes: String(data.get("notes") || ""),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/trade-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Could not send inquiry. Try again or email us.");
        return;
      }
      setStatus("ok");
      setMessage("Received. We will reply with next steps and documentation status.");
      trackEvent("inquiry_submit", { market: payload.targetMarket });
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Email edismart777@gmail.com or use WhatsApp.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 border border-forest/10 bg-oat/60 p-5 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm">
          <span className="label-caps text-forest/50">Organization</span>
          <input
            required
            name="organization"
            className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
          />
        </label>
        <label className="block text-sm">
          <span className="label-caps text-forest/50">Contact name</span>
          <input
            required
            name="contactName"
            className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
          />
        </label>
        <label className="block text-sm">
          <span className="label-caps text-forest/50">Work email</span>
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
          />
        </label>
        <label className="block text-sm">
          <span className="label-caps text-forest/50">Phone / WhatsApp</span>
          <input
            name="phone"
            className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="label-caps text-forest/50">Target market</span>
        <input
          required
          name="targetMarket"
          placeholder="e.g. UK specialty retail, NL distributor, US diaspora stores"
          className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
        />
      </label>

      <fieldset>
        <legend className="label-caps text-forest/50">Products of interest</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {products.map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm text-forest/80">
              <input
                type="checkbox"
                name="products"
                value={p}
                defaultChecked={prefill.has(p)}
                className="accent-forest"
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="label-caps text-forest/50">Estimated volume band</span>
        <select
          name="volumeBand"
          required
          className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
          defaultValue=""
        >
          <option value="" disabled>
            Select…
          </option>
          {volumes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-forest/80">
        <input type="checkbox" name="privateLabel" className="accent-forest" />
        Interested in private-label / contract packing discussion
      </label>

      <label className="block text-sm">
        <span className="label-caps text-forest/50">Certification needs</span>
        <textarea
          name="certificationNeeds"
          rows={2}
          placeholder="e.g. CoA, phytosanitary, importer labeling support"
          className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
        />
      </label>

      <label className="block text-sm">
        <span className="label-caps text-forest/50">Notes</span>
        <textarea
          name="notes"
          rows={3}
          className="mt-2 w-full rounded-lg border border-mist bg-white/70 px-3 py-2.5 text-forest outline-none focus:border-clay"
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-forest/70">
        <input type="checkbox" name="consent" required className="mt-1 accent-forest" />
        I consent to Edis Mart contacting me about this trade inquiry. We will
        not sell your details.
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="focus-ring inline-flex rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-oat transition hover:bg-clay disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request buyer pack"}
      </button>

      {message ? (
        <p
          role="status"
          className={`text-sm ${status === "ok" ? "text-sage" : "text-hibiscus"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
