import { formatGhs } from "@/lib/site";

export function OpsCredit({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-[10px] tracking-wide text-forest/40">
        POS & business systems by aadam · aadambuilds.dev · +233263039818
      </p>
    );
  }
  return (
    <p className="text-center text-[11px] leading-relaxed text-forest/45">
      POS & business systems · aadam
      <br />
      aadambuilds.dev · +233 26 303 9818
    </p>
  );
}

export { formatGhs };
