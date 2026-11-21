import type { Metadata } from "next";
import { CustomerBookings } from "@/components/dashboard/customer-bookings";

export const metadata: Metadata = { title: "My Bookings — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <CustomerBookings />;
}
