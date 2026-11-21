import type { Metadata } from "next";
import { AdminBookings } from "@/components/dashboard/admin-bookings";

export const metadata: Metadata = { title: "All Bookings — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <AdminBookings />;
}
