import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";
import { RequireRole } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "Jobs — FixMate" };

export default function Page() {
  return (
    <RequireRole role="technician">
      <BookingList
        endpoint="/api/bookings/jobs"
        viewer="technician"
        title="Jobs"
        description="Requests for your services. Accept or decline new requests, then update each job as you work on it."
        emptyDescription="Requests for your approved services will appear here."
      />
    </RequireRole>
  );
}
