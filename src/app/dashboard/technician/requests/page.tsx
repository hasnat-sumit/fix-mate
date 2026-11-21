import type { Metadata } from "next";
import { UpcomingSection } from "@/components/dashboard/dashboard-ui";

export const metadata: Metadata = { title: "Manage Requests — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <UpcomingSection title="Manage Requests" description="Requests for your services. Accept or reject new requests, then move each job forward." />;
}
