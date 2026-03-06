/**
 * Returns 'YYYY-MM' for a given Date
 */
export function toMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Returns the current month as 'YYYY-MM'
 */
export function currentMonth(): string {
  return toMonth(new Date());
}

/**
 * Generates an array of the last N months as 'YYYY-MM' strings, most recent last
 */
export function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(toMonth(d));
  }
  return months;
}

/**
 * Format 'YYYY-MM' → 'Mar 2026'
 */
export function formatMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Format 'YYYY-MM-DD' → 'Mar 6, 2026'
 */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a number as currency ($1,234.56)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate month options for a select, covering the last 12 months
 */
export function getMonthOptions(): { value: string; label: string }[] {
  return lastNMonths(12)
    .reverse()
    .map((m) => ({
      value: m,
      label: formatMonth(m),
    }));
}
