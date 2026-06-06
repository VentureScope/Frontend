import Link from "next/link";
import { cn } from "@/lib/utils";
import { VentureScopeLogo } from "@/components/brand/VentureScopeLogo";

type VentureScopeBrandLockupProps = {
  size?: number;
  href?: string;
  className?: string;
  logoClassName?: string;
  wordmarkClassName?: string;
  /** When true, mark uses `text-primary`. Default: true. */
  accent?: boolean;
  /** Show wordmark text beside the mark. Default: true. */
  showWordmark?: boolean;
};

/** Logo mark + VentureScope wordmark, optionally linked. */
export function VentureScopeBrandLockup({
  size = 28,
  href,
  className,
  logoClassName,
  wordmarkClassName,
  accent = true,
  showWordmark = true,
}: VentureScopeBrandLockupProps) {
  const content = (
    <>
      <VentureScopeLogo
        size={size}
        accent={accent}
        className={logoClassName}
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            wordmarkClassName,
          )}
        >
          VentureScope
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (href) {
    return (
      <Link href={href} className={classes} title="VentureScope">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
