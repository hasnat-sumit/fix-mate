import type { Metadata } from "next";
import { BookingList } from "@/components/dashboard/booking-list";

export const metadata: Metadata = { title: "My Bookings — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return (
    <BookingList
      endpoint="/api/bookings/my"
      viewer="customer"
      title="My Bookings"
      description="Repair requests you’ve sent, newest first. Open a request’s timeline to see every update."
      emptyDescription="When you request a service, it will appear here so you can follow its progress."
    />
  );
}
