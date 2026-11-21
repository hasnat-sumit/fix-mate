import type { Metadata } from "next";
import { RequireRole } from "@/components/dashboard/dashboard-shell";
import { TechnicianServices } from "@/components/dashboard/technician-services";

export const metadata: Metadata = { title: "My services — FixMate" };

export default function Page() {
  return (
    <RequireRole role="technician">
      <TechnicianServices />
    </RequireRole>
  );
}
