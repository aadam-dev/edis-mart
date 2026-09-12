import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Refunds" };

export default function RefundsPage() {
  return (
    <LegalShell title="Refunds">
      <p>
        If your order arrives damaged or incorrect, contact us within 48 hours
        at {site.phones[0]} or {site.email} with your order reference and a
        photo. We will replace or refund at our discretion.
      </p>
      <p>
        Perishable snack products that have been opened are not eligible for
        return unless defective.
      </p>
    </LegalShell>
  );
}
