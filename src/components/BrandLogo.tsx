import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Yeskoko wordmark — explicit pixel size so next/image never collapses to 0 width. */
export function BrandLogo({
  href = "/",
  height = 40,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * (1024 / 328));
  const image = (
    <Image
      src="/brand/logo.jpg"
      alt="Yeskoko"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`object-contain ${className}`}
      style={{ width, height }}
    />
  );

  if (!href) return image;
  return (
    <Link href={href} className="focus-ring inline-flex shrink-0">
      {image}
    </Link>
  );
}
