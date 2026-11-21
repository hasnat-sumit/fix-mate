import type { Metadata } from "next";
import { AdminServices } from "@/components/dashboard/admin-services";

export const metadata: Metadata = { title: "Service approvals — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return (
    <AdminServices />
  );
}
