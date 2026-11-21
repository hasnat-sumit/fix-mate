import type { Metadata } from "next";
import { TechnicianAddService } from "@/components/dashboard/technician-add-service";

export const metadata: Metadata = { title: "Add a Service — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <TechnicianAddService />;
}
