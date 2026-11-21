import type { Metadata } from "next";
import { UpcomingSection } from "@/components/dashboard/dashboard-ui";

export const metadata: Metadata = { title: "Add a Service — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <UpcomingSection title="Add a Service" description="List a new repair service. It appears publicly once an admin approves it." />;
}
