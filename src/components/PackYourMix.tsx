"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { fruitStories } from "@/lib/content";
import { catalog } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { formatGhs } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type Audience = "abroad" | "ghana";

function defaultAudience(): Audience {
  if (typeof navigator === "undefined") return "abroad";
  return /-GH$/i.test(navigator.language) ||
    /^ak|^ee|^tw/i.test(navigator.language)
    ? "ghana"
    : "abroad";
}

export function PackYourMix() {
  const reduce = useReducedMotion();
  const addItem = useCart((s) => s.addItem);
  const [selected, setSelected] = useState<string[]>([]);
  const [audience, setAudience] = useState<Audience>("abroad");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAudience(defaultAudience());
  }, []);

  const picks = fruitStories.filter((f) => selected.includes(f.id));

  const ghanaTotal = picks.reduce((sum, fruit) => {
    const product = catalog.find((p) => p.slug === fruit.mixSlug);
    const variant = product?.variants.find((v) => v.sku === fruit.mixSku);
    return sum + (variant?.retailPrice ?? 0);
  }, 0);

  const exportHref = useMemo(() => {
    const names = picks.map((p) => p.inquiryProduct);
    const q = encodeURIComponent(names.join(","));
    return `/export?products=${q}#inquiry`;
  }, [picks]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setAdded(false);
  };

  const setAud = (next: Audience) => {
    setAudience(next);
    setAdded(false);
    trackEvent("mix_toggle", { audience: next });
  };

  const addGhana = () => {
    if (!picks.length) return;
    for (const fruit of picks) {
      const product = catalog.find((p) => p.slug === fruit.mixSlug);
      const variant = product?.variants.find((v) => v.sku === fruit.mixSku);
      if (!product || !variant?.retailPrice) continue;
      addItem({
        productSlug: product.slug,
        productName: product.name,
        size: variant.size,
        sku: variant.sku,
        unitPrice: variant.retailPrice,
        image: product.image,
      });
    }
    setAdded(true);
    trackEvent("mix_cta", {
      audience: "ghana",
      products: picks.map((p) => p.id).join(","),
    });
  };

  return (
    <section
      id="mix"
      className="border-t border-mist/80 bg-oat"
      aria-label="Pack your mix"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
        <p className="label-caps text-sage">Sample tray</p>
        <h2 className="mt-3 max-w-[14ch] font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
          Pack <em className="italic">your mix.</em>
        </h2>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-forest/65">
          Tap a fruit. We&apos;ll fill the tray.
        </p>

        <div
          role="group"
          aria-label="Buying for"
          className="mt-8 inline-flex rounded-full border border-forest/15 p-1"
        >
          {(
            [
              ["abroad", "A shelf abroad"],
              ["ghana", "My kitchen in Ghana"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setAud(id)}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${
                audience === id
                  ? "bg-forest text-oat"
                  : "text-forest/60 hover:text-forest"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="relative aspect-square overflow-hidden bg-table lg:col-span-7">
            <Image
              src="/film/ghana/03-process/poster.jpg"
              alt=""
              fill
              className={`object-cover transition duration-500 ${
                reduce ? "" : "scale-[1.02]"
              }`}
              sizes="(max-width:1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 md:p-6">
              {fruitStories.map((fruit) => {
                const on = selected.includes(fruit.id);
                return (
                  <div
                    key={fruit.id}
                    className={`relative flex items-center justify-center rounded-sm border border-forest/10 bg-oat/70 p-3 backdrop-blur-sm transition ${
                      on ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    {on ? (
                      <Image
                        src={fruit.image}
                        alt=""
                        width={120}
                        height={160}
                        className="h-28 w-auto object-contain md:h-36"
                      />
                    ) : (
                      <span className="label-caps text-forest/40">
                        {fruit.giant}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              role="toolbar"
              aria-label="Fruits for your mix"
              className="grid grid-cols-2 gap-3"
            >
              {fruitStories.map((fruit) => {
                const pressed = selected.includes(fruit.id);
                return (
                  <button
                    key={fruit.id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => toggle(fruit.id)}
                    className={`focus-ring flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      pressed
                        ? "border-forest bg-forest text-oat"
                        : "border-forest/15 bg-cream/60 text-forest hover:border-forest/40"
                    }`}
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-table">
                      <Image
                        src={fruit.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="text-sm font-semibold">{fruit.giant}</span>
                  </button>
                );
              })}
            </div>

            <p className="sr-only" aria-live="polite">
              {picks.length
                ? `${picks.map((p) => p.giant).join(", ")} in your mix. ${picks.length} selected.`
                : "No fruits selected."}
            </p>

            <div className="mt-8 border-t border-forest/10 pt-6">
              {audience === "abroad" ? (
                <>
                  <p className="text-sm leading-relaxed text-forest/65">
                    {picks.length
                      ? `Sample set: ${picks.map((p) => p.inquiryProduct.toLowerCase()).join(", ")}.`
                      : "Pick at least one fruit for your sample set."}
                  </p>
                  {picks.length ? (
                    <Link
                      href={exportHref}
                      onClick={() =>
                        trackEvent("mix_cta", {
                          audience: "abroad",
                          products: picks.map((p) => p.id).join(","),
                        })
                      }
                      className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-oat transition hover:bg-clay"
                    >
                      Request these samples
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-5 inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-forest/30 px-5 py-3 text-sm font-semibold text-oat"
                    >
                      Pick at least one
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-forest/65">
                    {picks.length
                      ? `${picks.length} pouch${picks.length === 1 ? "" : "es"} · ${formatGhs(ghanaTotal)}`
                      : "Pick at least one pouch for your kitchen."}
                  </p>
                  {picks.length ? (
                    <button
                      type="button"
                      onClick={addGhana}
                      className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-oat transition hover:bg-clay"
                    >
                      {added
                        ? "Added"
                        : `Add ${picks.length} pouch${picks.length === 1 ? "" : "es"} to cart`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-5 inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-forest/30 px-5 py-3 text-sm font-semibold text-oat"
                    >
                      Pick at least one
                    </button>
                  )}
                  {added ? (
                    <Link
                      href="/cart"
                      className="mt-3 block text-sm font-semibold text-clay underline-offset-4 hover:underline"
                    >
                      View cart →
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
