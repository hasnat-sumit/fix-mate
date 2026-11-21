import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin-overview";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "Admin overview — FixMate" };

export default function Page() {
  return (
    <RequireRole role="admin">
      <AdminOverview />
    </RequireRole>
  );
}
