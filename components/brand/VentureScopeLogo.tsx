import { cn } from "@/lib/utils";

type VentureScopeLogoProps = {
  size?: number;
  className?: string;
  /** When true, mark uses `text-primary` (accent palette aware). Default: true. */
  accent?: boolean;
};

/** VentureScope scope mark — viewfinder ring + focal point. */
export function VentureScopeLogo({
  size = 28,
  className,
  accent = true,
}: VentureScopeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", accent && "text-primary", className)}
      aria-hidden
    >
      <path
        d="M24 5C33.941 5 42 13.059 42 23C42 28.743 39.098 33.77 34.8 36.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 43C14.059 43 6 34.941 6 25C6 19.257 8.902 14.23 13.2 11.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M24 8V12M24 36V40M8 24H12M36 24H40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="24" cy="24" r="5.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}
