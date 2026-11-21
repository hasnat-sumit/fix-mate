import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin-users";

export const metadata: Metadata = { title: "Manage Users — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <AdminUsers />;
}
