export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        {title}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink/75">
        {children}
      </div>
    </div>
  );
}
