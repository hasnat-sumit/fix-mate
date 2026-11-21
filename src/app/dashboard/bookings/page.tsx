import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "My requests — FixMate" };

export default function Page() {
  return (
    <RequireRole role="customer">
      <BookingList
        endpoint="/api/bookings/mine"
        viewer="customer"
        title="My requests"
        description="Repair requests you’ve sent, newest first. Open a request’s timeline to see every update."
        emptyDescription="When you request a service, it will appear here so you can follow its progress."
      />
    </RequireRole>
  );
}
