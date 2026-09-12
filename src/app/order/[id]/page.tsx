import { Suspense } from "react";
import OrderClient from "./OrderClient";

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-ink/60">
          Loading order...
        </div>
      }
    >
      <OrderClient />
    </Suspense>
  );
}
