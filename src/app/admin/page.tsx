"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatGhs } from "@/lib/site";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  channel: string;
  variants: {
    id: string;
    size: string;
    sku: string;
    retailPrice: number | null;
    wholesalePrice: number | null;
    stock: number;
  }[];
};

type OrderRow = {
  id: string;
  reference: string;
  status: string;
  paymentMethod: string;
  customerName: string;
  total: number;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  const load = async (pwd: string) => {
    const res = await fetch("/api/admin/data", {
      headers: { "x-admin-password": pwd },
    });
    if (!res.ok) {
      setError("Wrong password");
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setProducts(data.products);
    setOrders(data.orders);
    setAuthed(true);
    sessionStorage.setItem("yeskoko-admin", pwd);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("yeskoko-admin");
    if (saved) {
      setPassword(saved);
      load(saved);
    }
  }, []);

  const saveStock = async (variantId: string, stock: number) => {
    const res = await fetch("/api/admin/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ variantId, stock }),
    });
    if (res.ok) load(password);
  };

  const setStatus = async (orderId: string, status: string) => {
    const res = await fetch("/api/admin/order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) load(password);
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            load(password);
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-mist px-3 py-3 text-sm"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-leaf px-4 py-3 text-sm font-semibold text-white"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">Ops</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "orders" ? "bg-leaf text-white" : "bg-mist"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "products" ? "bg-leaf text-white" : "bg-mist"
            }`}
          >
            Stock
          </button>
          <button
            type="button"
            className="text-sm text-ink/55"
            onClick={() => {
              sessionStorage.removeItem("yeskoko-admin");
              setAuthed(false);
              router.refresh();
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {tab === "orders" && (
        <div className="mt-8 overflow-x-auto border border-mist bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-mist/50">
              <tr>
                <th className="px-3 py-2">Ref</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Pay</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-mist">
                  <td className="px-3 py-2 font-mono text-xs">{o.reference}</td>
                  <td className="px-3 py-2">{o.customerName}</td>
                  <td className="px-3 py-2">{o.paymentMethod}</td>
                  <td className="px-3 py-2">{formatGhs(o.total)}</td>
                  <td className="px-3 py-2">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="rounded border border-mist px-2 py-1"
                    >
                      {[
                        "pending",
                        "pending_cod",
                        "paid",
                        "fulfilled",
                        "cancelled",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="mt-8 space-y-6">
          {products.map((p) => (
            <div key={p.id} className="border border-mist bg-white p-4">
              <p className="font-semibold">
                {p.name}{" "}
                <span className="text-xs font-normal text-ink/50">
                  {p.channel}
                </span>
              </p>
              <ul className="mt-3 space-y-2">
                {p.variants.map((v) => (
                  <li
                    key={v.id}
                    className="flex flex-wrap items-center gap-3 text-sm"
                  >
                    <span className="w-16 font-medium">{v.size}</span>
                    <span className="text-ink/55">{v.sku}</span>
                    <span>
                      Retail {formatGhs(v.retailPrice)} / Wholesale{" "}
                      {formatGhs(v.wholesalePrice)}
                    </span>
                    <label className="ml-auto flex items-center gap-2">
                      Stock
                      <input
                        type="number"
                        defaultValue={v.stock}
                        className="w-20 rounded border border-mist px-2 py-1"
                        onBlur={(e) =>
                          saveStock(v.id, Number(e.target.value) || 0)
                        }
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
