import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email, or WhatsApp Yeskoko by Edis Mart in Accra.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Contact
      </h1>
      <p className="mt-3 text-ink/70">
        Available {site.hours}. We reply on phone and WhatsApp.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={`tel:${site.phones[0]}`}
          className="border border-mist bg-white p-6 transition hover:border-leaf"
        >
          <p className="text-sm font-semibold text-leaf">Call</p>
          <p className="mt-2 font-display text-xl font-semibold">
            {site.phones[0]}
          </p>
          <p className="mt-1 text-sm text-ink/60">{site.phones[1]}</p>
        </a>
        <a
          href={`mailto:${site.email}`}
          className="border border-mist bg-white p-6 transition hover:border-leaf"
        >
          <p className="text-sm font-semibold text-leaf">Email</p>
          <p className="mt-2 font-display text-xl font-semibold">{site.email}</p>
        </a>
      </div>
      <a
        href={whatsappLink("Hi Yeskoko, I have a question about...")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-leaf px-5 py-3 text-base font-semibold text-white hover:bg-forest"
      >
        Message on WhatsApp
      </a>
    </div>
  );
}
