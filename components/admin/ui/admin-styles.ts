/** Shared Tailwind classes — uses the same design tokens as the member dashboard. */

export const adminPage = "space-y-4";

export const adminSectionLabel = "text-label text-muted-foreground";

export const adminCard = "rounded-xl border border-border bg-card";

export const adminSection = `${adminCard} p-4 sm:p-5`;

export const adminPageTitle = "text-lg font-semibold text-foreground";

export const adminPageDesc = "text-sm text-muted-foreground";

export const adminInput =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20";

export const adminGhostBtn =
  "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted";

export const adminPrimaryBtn =
  "rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15";

export const adminRedBtn =
  "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/15";

/** @deprecated Use adminPrimaryBtn */
export const adminEmeraldBtn = adminPrimaryBtn;

export const adminTableTh =
  "px-3 py-2 text-left text-label font-normal uppercase tracking-widest text-muted-foreground";

export const adminTableRow = "border-b border-border/60 odd:bg-muted/20 transition-colors hover:bg-muted/40";

export const adminErrorBanner =
  "mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive";

export const adminLoading =
  "flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground";

export const adminFilterBtnActive =
  "rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary";

export const adminFilterBtn =
  "rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/25 hover:text-foreground";
