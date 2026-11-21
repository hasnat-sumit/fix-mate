import type { Metadata } from "next";
import { TechnicianOverview } from "@/components/dashboard/technician-overview";

export const metadata: Metadata = { title: "Overview — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <TechnicianOverview />;
}
