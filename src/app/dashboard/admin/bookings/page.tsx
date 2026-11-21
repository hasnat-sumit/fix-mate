import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";

export const metadata: Metadata = { title: "All bookings — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return (
    <BookingList
      endpoint="/api/admin/bookings"
      viewer="admin"
      title="All bookings"
      description="Every booking on FixMate. Admins can cancel pending or accepted bookings, for example at a customer’s request."
      emptyDescription="Bookings will appear here once customers start requesting services."
    />
  );
}
