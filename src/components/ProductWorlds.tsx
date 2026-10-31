import Image from "next/image";
import Link from "next/link";
import { productWorlds } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function ProductWorlds() {
  return (
    <section id="products" className="section-band border-t border-mist/80">
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <p className="label-caps text-sage">The pantry</p>
          <h2 className="mt-4 max-w-[16ch] font-display text-4xl font-medium tracking-tight text-forest md:text-5xl lg:text-6xl">
            Four fruit worlds. One Accra house.
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-forest/65 md:text-lg">
            Coconut flakes, chia coco, mango chips, and pineapple chips — each
            with its own texture, same standard: dried in Ghana without
            preservatives.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {productWorlds.map((world, i) => (
            <Reveal key={world.slug} delay={0.05 * i}>
              <Link
                href={`/product/${world.slug}`}
                className={`group relative block overflow-hidden bg-gradient-to-b ${world.tone} to-transparent`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={world.image}
                    alt={world.name}
                    fill
                    className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-oat">
                    <p className="label-caps text-oat/70">{world.eyebrow}</p>
                    <p className="mt-2 font-display text-2xl font-medium leading-tight md:text-3xl">
                      {world.name}
                    </p>
                    <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-oat/80">
                      {world.blurb}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 top-6 select-none font-display text-[clamp(3rem,8vw,5.5rem)] font-medium leading-none text-forest/[0.07] transition duration-700 group-hover:text-forest/[0.12]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
