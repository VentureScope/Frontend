export type AdminQueryValue = string | number | boolean;

function toCamelCase(snake: string): string {
  return snake.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function toSnakeCase(key: string): string {
  if (key.includes("_")) return key;
  return key
    .replace(/([A-Z])/g, (_, letter: string) => `_${letter.toLowerCase()}`)
    .replace(/^_/, "");
}

/**
 * Duplicate each query param as snake_case and camelCase so backends that
 * expect either convention both receive the value (e.g. per_page + perPage).
 */
export function adminQueryParams(
  entries: Record<string, AdminQueryValue | undefined | null>,
): Record<string, AdminQueryValue> {
  const out: Record<string, AdminQueryValue> = {};

  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined || value === null) continue;

    const snake = toSnakeCase(key);
    const camel = toCamelCase(snake);

    out[snake] = value;
    if (camel !== snake) {
      out[camel] = value;
    }
  }

  return out;
}
