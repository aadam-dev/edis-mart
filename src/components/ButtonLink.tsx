import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const styles = {
  primary:
    "bg-forest text-oat hover:bg-clay active:scale-[0.98]",
  secondary:
    "border border-forest/20 bg-transparent text-forest hover:border-forest hover:bg-forest/5 active:scale-[0.98]",
  ghost: "text-forest underline-offset-4 hover:underline",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
