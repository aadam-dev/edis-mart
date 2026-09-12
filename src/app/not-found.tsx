import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-ink/70">That path is not in the Yeskoko pantry.</p>
      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-full bg-leaf px-5 py-3 text-sm font-semibold text-white"
      >
        Back to shop
      </Link>
    </div>
  );
}
