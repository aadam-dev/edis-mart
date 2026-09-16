const CREDIT = {
  label: "POS & business systems by PronajGH",
  url: "https://pronajgh.com",
  phone: "+233559602056",
  phoneDisplay: "+233 55 960 2056",
};

export function OpsCredit({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-center text-[10px] leading-relaxed tracking-wide text-forest/45">
        {CREDIT.label}
        <br />
        <a
          href={CREDIT.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-forest/25 underline-offset-2 hover:text-forest/70"
        >
          pronajgh.com
        </a>
        {" · "}
        <a
          href={`tel:${CREDIT.phone}`}
          className="tabular-nums underline decoration-forest/25 underline-offset-2 hover:text-forest/70"
        >
          {CREDIT.phoneDisplay}
        </a>
      </p>
    );
  }
  return (
    <p className="text-center text-[11px] leading-relaxed text-forest/50">
      {CREDIT.label}
      <br />
      <a
        href={CREDIT.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-forest/30 underline-offset-2 hover:text-forest/70"
      >
        pronajgh.com
      </a>
      {" · "}
      <a
        href={`tel:${CREDIT.phone}`}
        className="tabular-nums underline decoration-forest/30 underline-offset-2 hover:text-forest/70"
      >
        {CREDIT.phoneDisplay}
      </a>
    </p>
  );
}
