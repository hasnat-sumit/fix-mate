import type { Metadata } from "next";
import { AdminServices } from "@/components/dashboard/admin-services";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "Service approvals — FixMate" };

export default function Page() {
  return (
    <RequireRole role="admin">
      <AdminServices />
    </RequireRole>
  );
}
