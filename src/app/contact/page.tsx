import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email, or WhatsApp Yeskoko by Edis Mart in Accra.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <h1 className="font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          Contact
        </h1>
        <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-forest/70 md:text-xl">
          Available {site.hours}. We reply on phone and WhatsApp.
        </p>
      </Reveal>
      
      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <Reveal delay={0.1}>
          <a
            href={`tel:${site.phones[0]}`}
            className="group block border-t border-mist/80 pt-6 transition hover:border-clay/50"
          >
            <p className="label-caps text-clay">Call</p>
            <p className="mt-3 font-display text-3xl font-medium text-forest transition group-hover:text-clay">
              {site.phones[0]}
            </p>
            <p className="mt-1 text-sm text-forest/60">{site.phones[1]}</p>
          </a>
        </Reveal>
        
        <Reveal delay={0.2}>
          <a
            href={`mailto:${site.email}`}
            className="group block border-t border-mist/80 pt-6 transition hover:border-clay/50"
          >
            <p className="label-caps text-clay">Email</p>
            <p className="mt-3 font-display text-3xl font-medium text-forest transition group-hover:text-clay">
              {site.email}
            </p>
          </a>
        </Reveal>
      </div>
      
      <Reveal delay={0.3}>
        <div className="mt-16">
          <a
            href={whatsappLink("Hi Yeskoko, I have a question about...")}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center justify-center rounded-full bg-clay px-6 py-3.5 text-sm font-semibold tracking-wide text-oat transition duration-500 hover:bg-forest active:scale-[0.98]"
          >
            Message on WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
