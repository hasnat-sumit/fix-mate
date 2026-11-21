import type { Metadata } from "next";
import { TechnicianRequests } from "@/components/dashboard/technician-requests";

export const metadata: Metadata = { title: "Manage Requests — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <TechnicianRequests />;
}
