import type { Metadata } from "next";
import { UpcomingSection } from "@/components/dashboard/dashboard-ui";

export const metadata: Metadata = { title: "Transactions — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <UpcomingSection title="Transactions" description="Every payment made on FixMate, with the total revenue." />;
}
