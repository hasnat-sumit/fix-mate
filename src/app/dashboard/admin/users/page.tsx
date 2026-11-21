import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin-users";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "Users — FixMate" };

export default function Page() {
  return (
    <RequireRole role="admin">
      <AdminUsers />
    </RequireRole>
  );
}
