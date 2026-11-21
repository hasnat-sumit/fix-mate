"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, selectClassName, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { bookingStatuses, type Booking, type BookingStatus, type Paged } from "@/lib/dashboard-types";
import { formatCalendarDate, formatPrice, formatStatus } from "@/lib/format";

const columns: Column<Booking>[] = [
  { header: "Service", className: "min-w-[200px]", cell: (booking) => <span className="line-clamp-2 font-semibold text-foreground">{booking.serviceTitle}</span> },
  {
    header: "Customer",
    cell: (booking) => (
      <div className="min-w-0">
        <p>{booking.customerName}</p>
        <p className="truncate text-xs text-muted-foreground">{booking.customerEmail}</p>
      </div>
    ),
  },
  { header: "Technician", cell: (booking) => booking.technicianName },
  { header: "Date", cell: (booking) => <span className="whitespace-nowrap tabular-nums">{formatCalendarDate(booking.preferredDate.slice(0, 10))}</span> },
  { header: "Status", cell: (booking) => <StatusBadge status={booking.status} /> },
  { header: "Payment", cell: (booking) => <StatusBadge status={booking.paymentStatus} /> },
  {
    header: "Amount",
    cell: (booking) => <span className="whitespace-nowrap tabular-nums font-semibold text-foreground">{formatPrice(booking.status === "completed" ? booking.finalAmount : booking.basePrice)}</span>,
  },
];

/** All Bookings: a read-only view of every repair job on the platform, filterable by status. */
export function AdminBookings() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<Booking>>(`/api/admin/bookings?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="All Bookings"
        description="Every repair job on FixMate (read-only). Amounts show the final amount once a job is completed, otherwise the base price."
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="admin-booking-status" className="text-sm font-semibold text-muted-foreground">
              Status
            </label>
            <select
              id="admin-booking-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BookingStatus | "");
                setPage(1);
              }}
              className={selectClassName}
            >
              <option value="">All</option>
              {bookingStatuses.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "booking" : "bookings"}` : ""}
      </p>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle={status ? `No ${formatStatus(status).toLowerCase()} bookings` : "No bookings yet"}
        emptyDescription={status ? "Try another status filter." : "Bookings appear here once customers start requesting services."}
        onRetry={reload}
      >
        {data ? <DataTable caption="All bookings" rows={data.items} columns={columns} rowKey={(booking) => booking._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}
