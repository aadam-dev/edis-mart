import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of sale" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms of sale">
      <p>
        By placing an order on {site.domain} you agree to pay the listed GHS
        price plus any stated delivery fee. Orders are fulfilled by {site.company}{" "}
        in Accra, Ghana.
      </p>
      <p>
        Product images show current packaging and may vary slightly by batch.
        Wholesale quotes are confirmed separately on WhatsApp.
      </p>
    </LegalShell>
  );
}
