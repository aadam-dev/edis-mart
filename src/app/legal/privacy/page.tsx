import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy policy">
      <p>
        {site.company} (&quot;Yeskoko&quot;) collects the name, phone, email,
        and delivery details you provide at checkout so we can fulfil orders and
        contact you about them.
      </p>
      <p>
        Payment card and MoMo data is processed by Paystack. We do not store
        full card numbers on our servers.
      </p>
      <p>
        Contact {site.email} or {site.phones[0]} for privacy requests.
      </p>
    </LegalShell>
  );
}
