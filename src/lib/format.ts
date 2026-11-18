const wholeDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const withCents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Formats a price stored in cents: 4900 -> "$49", 4950 -> "$49.50". */
export function formatPrice(cents: number) {
  return cents % 100 === 0 ? wholeDollars.format(cents / 100) : withCents.format(cents / 100);
}
