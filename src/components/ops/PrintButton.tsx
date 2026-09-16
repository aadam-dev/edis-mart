"use client";

import { useEffect } from "react";

export function PrintActions({
  receiptNumber,
  autoPrint = false,
}: {
  receiptNumber: string;
  autoPrint?: boolean;
}) {
  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(t);
  }, [autoPrint]);

  const prepare = () => {
    const prev = document.title;
    document.title = `${receiptNumber} · Yeskoko receipt`;
    window.setTimeout(() => {
      document.title = prev;
    }, 2000);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 print:hidden">
      <button
        type="button"
        onClick={() => {
          prepare();
          window.print();
        }}
        className="rounded-full bg-clay px-4 py-2.5 text-sm font-semibold text-oat"
      >
        Print
      </button>
      <button
        type="button"
        onClick={() => {
          prepare();
          window.print();
        }}
        className="rounded-full border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-forest"
        title="In the print dialog, choose Save as PDF / Microsoft Print to PDF"
      >
        Save PDF
      </button>
    </div>
  );
}

/** @deprecated use PrintActions */
export function PrintButton() {
  return <PrintActions receiptNumber="receipt" />;
}
