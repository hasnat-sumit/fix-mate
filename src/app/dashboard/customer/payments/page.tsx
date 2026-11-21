import type { Metadata } from "next";
import { CustomerPayments } from "@/components/dashboard/customer-payments";

export const metadata: Metadata = { title: "Payment History — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <CustomerPayments />;
}
