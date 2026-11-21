import type { Metadata } from "next";
import { TechnicianServices } from "@/components/dashboard/technician-services";

export const metadata: Metadata = { title: "My Services — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <TechnicianServices />;
}
