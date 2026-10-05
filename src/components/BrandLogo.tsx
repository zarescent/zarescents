import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center ${className}`}
      aria-label="Zaré Scents home"
    >
      <Image
        src="/images/logo.png"
        alt="Zaré Scents"
        width={compact ? 44 : 72}
        height={compact ? 44 : 72}
        priority={!compact}
        className={`rounded-full object-cover shadow-[0_0_0_1px_rgba(212,175,100,0.28)] transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_10px_rgba(212,175,100,0.22)] ${
          compact
            ? "h-9 w-9 md:h-10 md:w-10"
            : "h-12 w-12 sm:h-14 sm:w-14 md:h-[3.75rem] md:w-[3.75rem]"
        }`}
      />
    </Link>
  );
}
