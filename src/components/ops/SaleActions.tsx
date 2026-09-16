"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatGhPhoneDisplay, formatGhs } from "@/lib/site";

type Line = {
  id: string;
  productName: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  returnedQty: number;
};

export function SaleActions({
  saleId,
  status,
  customerName: initialName,
  customerPhone: initialPhone,
  paymentRef: initialRef,
  lines,
}: {
  saleId: string;
  status: string;
  customerName: string;
  customerPhone: string;
  paymentRef: string;
  lines: Line[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(
    initialPhone ? formatGhPhoneDisplay(initialPhone) : "",
  );
  const [ref, setRef] = useState(initialRef);
  const [note, setNote] = useState("");
  const [returnQtys, setReturnQtys] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const l of lines) {
      const rem = l.quantity - l.returnedQty;
      init[l.id] = rem > 0 ? String(rem) : "0";
    }
    return init;
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const completed = status === "completed";

  const saveDetails = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await fetch(`/api/admin/sales/${saleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        paymentRef: ref,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not save");
      return;
    }
    setMsg("Sale details updated");
    router.refresh();
  };

  const doReturn = async (full: boolean) => {
    if (!completed) return;
    const confirmMsg = full
      ? "Return entire sale and restock all items?"
      : "Return selected quantities and restock?";
    if (!window.confirm(confirmMsg)) return;

    setBusy(true);
    setErr("");
    setMsg("");

    const payload: {
      action: "return";
      note?: string;
      lines?: { lineId: string; quantity: number }[];
    } = {
      action: "return",
      note: note.trim() || undefined,
    };

    if (!full) {
      const selected = lines
        .map((l) => ({
          lineId: l.id,
          quantity: Math.round(Number(returnQtys[l.id] || 0)),
        }))
        .filter((r) => r.quantity > 0);
      if (selected.length === 0) {
        setBusy(false);
        setErr("Enter return quantities");
        return;
      }
      payload.lines = selected;
    }

    const res = await fetch(`/api/admin/sales/${saleId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Return failed");
      return;
    }
    setMsg(data.partial ? "Partial return recorded" : "Sale returned");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 border border-mist bg-white/50 p-5">
        <h2 className="font-display text-xl font-medium text-forest">
          Modify details
        </h2>
        <p className="text-sm text-forest/55">
          Update customer or payment reference. Line items are changed via
          return.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span>Customer name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!completed || busy}
              className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 disabled:opacity-50"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!completed || busy}
              className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 disabled:opacity-50"
              placeholder="0549092316"
            />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span>Payment reference</span>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              disabled={!completed || busy}
              className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 disabled:opacity-50"
              placeholder="Optional MoMo / bank ref"
            />
          </label>
        </div>
        {completed && (
          <button
            type="button"
            disabled={busy}
            onClick={saveDetails}
            className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-oat disabled:opacity-50"
          >
            Save changes
          </button>
        )}
      </section>

      <section className="space-y-4 border border-mist bg-white/50 p-5">
        <h2 className="font-display text-xl font-medium text-forest">Return</h2>
        <p className="text-sm text-forest/55">
          Restocks finished packs. Returned cash/MoMo should be settled offline.
        </p>
        <ul className="space-y-3 text-sm">
          {lines.map((l) => {
            const rem = l.quantity - l.returnedQty;
            return (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-mist/60 pb-3"
              >
                <div>
                  <p className="font-medium">
                    {l.productName} · {l.size}
                  </p>
                  <p className="text-xs text-forest/50">
                    {l.sku} · sold {l.quantity} ·{" "}
                    {formatGhs(l.unitPrice)} each
                    {l.returnedQty > 0 && ` · already returned ${l.returnedQty}`}
                  </p>
                </div>
                {completed && rem > 0 ? (
                  <label className="flex items-center gap-2 text-xs">
                    Return qty
                    <input
                      type="number"
                      min={0}
                      max={rem}
                      value={returnQtys[l.id] ?? "0"}
                      onChange={(e) =>
                        setReturnQtys((prev) => ({
                          ...prev,
                          [l.id]: e.target.value,
                        }))
                      }
                      className="w-16 rounded-lg border border-mist px-2 py-1.5 tabular-nums"
                    />
                    <span className="text-forest/40">/ {rem}</span>
                  </label>
                ) : (
                  <span className="text-xs text-forest/45">
                    {rem <= 0 ? "Fully returned" : status}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        {completed && (
          <>
            <label className="block space-y-1 text-sm">
              <span>Return note</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-mist bg-white px-3 py-2.5"
                placeholder="Reason (optional)"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => doReturn(false)}
                className="rounded-full border border-mist bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                Return selected
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => doReturn(true)}
                className="rounded-full border border-clay/40 bg-clay/10 px-4 py-2.5 text-sm font-semibold text-clay disabled:opacity-50"
              >
                Return entire sale
              </button>
            </div>
          </>
        )}
      </section>

      {err && <p className="text-sm text-clay">{err}</p>}
      {msg && <p className="text-sm text-sage">{msg}</p>}
    </div>
  );
}
