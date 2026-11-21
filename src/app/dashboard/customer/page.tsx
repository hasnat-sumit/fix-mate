import type { Metadata } from "next";
import { CustomerOverview } from "@/components/dashboard/customer-overview";

export const metadata: Metadata = { title: "Overview — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <CustomerOverview />;
}
