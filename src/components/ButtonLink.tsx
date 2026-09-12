import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const styles = {
  primary:
    "bg-leaf text-white hover:bg-forest active:scale-[0.98]",
  secondary:
    "border border-forest/20 bg-white text-ink hover:border-leaf active:scale-[0.98]",
  ghost: "text-leaf underline-offset-4 hover:underline",
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
      className={`focus-ring inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
