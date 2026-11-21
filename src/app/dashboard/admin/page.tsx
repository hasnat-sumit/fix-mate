import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin-overview";

export const metadata: Metadata = { title: "Admin Overview — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <AdminOverview />;
}
