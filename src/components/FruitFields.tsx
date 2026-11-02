import Image from "next/image";
import Link from "next/link";
import { fruitStories } from "@/lib/content";

const fieldBg: Record<(typeof fruitStories)[number]["field"], string> = {
  "field-coconut": "bg-field-coconut",
  "field-chia": "bg-field-chia",
  "field-mango": "bg-field-mango",
  "field-pineapple": "bg-field-pineapple",
};

export function FruitFields() {
  return (
    <section id="products" aria-label="Four fruit fields">
      <div className="border-t border-mist/80 bg-oat px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-sage">The pantry</p>
          <h2 className="mt-3 max-w-[18ch] font-display text-3xl font-medium tracking-tight text-forest md:text-5xl">
            Four snacks. <em className="italic">Four different bites.</em>
          </h2>
        </div>
      </div>

      {fruitStories.map((story) => {
        const light = story.ink === "forest";
        return (
          <article
            key={story.id}
            id={`fruit-${story.id}`}
            className={`relative sticky top-0 flex min-h-[100svh] flex-col justify-end overflow-hidden ${fieldBg[story.field]}`}
          >
            <p
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 top-[8%] select-none text-center font-display text-[clamp(5rem,22vw,22rem)] font-medium italic leading-none tracking-tight ${
                light ? "text-forest/[0.14]" : "text-oat/[0.14]"
              }`}
            >
              {story.giant}
            </p>

            <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-end gap-8 px-4 pb-10 pt-24 md:grid-cols-12 md:items-center md:px-6 md:pb-16 md:pt-20">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] md:col-span-5 md:col-start-4 md:max-w-none md:h-[56svh] md:aspect-auto">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  className="object-contain object-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)]"
                  sizes="(max-width:768px) 70vw, 28vw"
                />
              </div>

              <div
                className={`md:col-span-4 md:col-start-9 ${
                  light ? "text-forest" : "text-oat"
                }`}
              >
                <p
                  className={`label-caps ${
                    light ? "text-forest/55" : "text-oat/55"
                  }`}
                >
                  {story.eyebrow}
                </p>
                <h3 className="mt-3 max-w-[16ch] font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {story.hook.includes("like the nut") ? (
                    <>
                      Flakes that still taste{" "}
                      <em className="italic">like the nut.</em>
                    </>
                  ) : story.hook.includes("seed crunch") ? (
                    <>
                      Coconut with <em className="italic">a seed crunch.</em>
                    </>
                  ) : story.hook.includes("slow chew") ? (
                    <>
                      Ripe mango,{" "}
                      <em className="italic">dried to a slow chew.</em>
                    </>
                  ) : (
                    <>
                      Pineapple <em className="italic">you can hear.</em>
                    </>
                  )}
                </h3>
                <p
                  className={`mt-4 max-w-[40ch] text-sm leading-relaxed md:text-base ${
                    light ? "text-forest/72" : "text-oat/72"
                  }`}
                >
                  {story.line}
                </p>
                <p
                  className={`mt-3 label-caps ${
                    light ? "text-forest/45" : "text-oat/45"
                  }`}
                >
                  {story.spec}
                </p>
                <Link
                  href={story.productHref}
                  className={`focus-ring mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition md:w-auto ${
                    light
                      ? "bg-forest text-oat hover:bg-clay"
                      : "bg-oat text-forest hover:bg-cream"
                  }`}
                >
                  {story.cta}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
