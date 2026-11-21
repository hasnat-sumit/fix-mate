import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "All bookings — FixMate" };

export default function Page() {
  return (
    <RequireRole role="admin">
      <BookingList
        endpoint="/api/admin/bookings"
        viewer="admin"
        title="All bookings"
        description="Every booking on FixMate. Admins can cancel pending or accepted bookings, for example at a customer’s request."
        emptyDescription="Bookings will appear here once customers start requesting services."
      />
    </RequireRole>
  );
}
