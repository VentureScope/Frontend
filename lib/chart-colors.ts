/**
 * Palette-aware chart colors — use CSS variables so `data-palette` applies everywhere.
 * Recharts/SVG accept `var(--chart-N)` strings in fill/stroke props.
 */
export const CHART_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const SEMANTIC_CHART_COLORS = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  accent: "var(--accent)",
  muted: "var(--muted-foreground)",
} as const;

export function chartColorVar(index: number): string {
  return CHART_COLOR_VARS[index % CHART_COLOR_VARS.length];
}
