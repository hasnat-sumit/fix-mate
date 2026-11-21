const wholeDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const withCents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Formats a USD amount: 49 -> "$49", 49.5 -> "$49.50". */
export function formatPrice(amount: number) {
  return Number.isInteger(amount) ? wholeDollars.format(amount) : withCents.format(amount);
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** A calendar date ("2026-11-23") shown as-is, without time-zone shifting: "Nov 23, 2026". */
export function formatCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return dateFormat.format(new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1));
}

/** A timestamp in the viewer's local time: "Nov 23, 2026, 4:05 PM". */
export function formatDateTime(value: string) {
  return dateTimeFormat.format(new Date(value));
}

/** "in-progress" -> "In progress". */
export function formatStatus(status: string) {
  const text = status.replace(/[_-]/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
