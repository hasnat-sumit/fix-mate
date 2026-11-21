import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";

export const metadata: Metadata = { title: "Manage Requests — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return (
    <BookingList
      endpoint="/api/bookings/technician"
      viewer="technician"
      title="Manage Requests"
      description="Requests for your services. Accept or decline new requests, then update each job as you work on it."
      emptyDescription="Requests for your approved services will appear here."
    />
  );
}
