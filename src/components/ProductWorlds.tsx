import Image from "next/image";
import Link from "next/link";
import { fruitStories } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function ProductWorlds() {
  return (
    <section id="products" className="section-band border-t border-mist/80">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <p className="label-caps text-sage">The pantry</p>
          <h2 className="mt-4 max-w-[18ch] font-display text-4xl font-medium tracking-tight text-forest md:text-5xl lg:text-6xl">
            Four fruits. Four stories. One Accra house.
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-forest/65 md:text-lg">
            Coconut flakes, chia coco, mango chips, and pineapple chips — each
            with its own bite, same standard: dried in Ghana without
            preservatives.
          </p>
        </Reveal>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {fruitStories.map((story, i) => {
            const mediaLeft = i % 2 === 0;
            return (
              <Reveal key={story.id} delay={0.04 * i}>
                <article
                  id={`fruit-${story.id}`}
                  className="grid items-center gap-8 md:grid-cols-12 md:gap-12"
                >
                  <div
                    className={`relative aspect-[4/5] overflow-hidden bg-[#e7d3bf] md:col-span-5 md:aspect-[3/4] ${
                      mediaLeft ? "md:col-start-1" : "md:col-start-8"
                    }`}
                  >
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      className="object-contain object-center p-6 md:p-8"
                      sizes="(max-width:768px) 100vw, 40vw"
                    />
                  </div>

                  <div
                    className={`md:col-span-6 ${
                      mediaLeft
                        ? "md:col-start-7"
                        : "md:col-start-1 md:row-start-1"
                    }`}
                  >
                    <p className="label-caps text-clay">{story.eyebrow}</p>
                    <h3 className="mt-3 max-w-[16ch] font-display text-3xl font-medium tracking-tight text-forest md:text-4xl lg:text-5xl">
                      {story.headline}
                    </h3>
                    <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-forest/65 md:text-lg">
                      {story.body}
                    </p>
                    <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-forest/50">
                      {story.occasion}
                    </p>
                    <p className="mt-2 label-caps text-forest/40">
                      {story.formats}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={story.productHref}
                        className="focus-ring inline-flex rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-oat transition hover:bg-clay"
                      >
                        View product
                      </Link>
                      <Link
                        href={story.exportHref}
                        className="focus-ring inline-flex rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition hover:border-forest"
                      >
                        Export interest
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
