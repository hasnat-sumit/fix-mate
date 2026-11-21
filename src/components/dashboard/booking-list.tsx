"use client";

import { useState } from "react";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { BookingCard, type BookingViewer } from "@/components/dashboard/booking-card";
import { DataState, PageHeader, Pager, selectClassName } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { bookingStatuses, type Booking, type BookingStatus, type Paged } from "@/lib/dashboard-types";
import { formatStatus } from "@/lib/format";

type BookingListProps = {
  endpoint: string;
  viewer: BookingViewer;
  title: string;
  description: string;
  emptyDescription: string;
};

/** A filterable, paged list of bookings with the actions available to the viewer. */
export function BookingList({ endpoint, viewer, title, description, emptyDescription }: BookingListProps) {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(1);
  const search = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<Booking>>(`${endpoint}?${search.toString()}`);
  const filterId = `${viewer}-booking-status`;

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor={filterId} className="text-sm font-semibold text-muted-foreground">
              Status
            </label>
            <select
              id={filterId}
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
        emptyDescription={emptyDescription}
        onRetry={reload}
      >
        {error ? <p role="alert" className="mt-4 text-sm text-error">{error.message}</p> : null}
        <div className="mt-4 space-y-4">
          {data?.items.map((booking) => (
            <BookingCard key={booking.id} booking={booking} viewer={viewer} actions={<BookingActions booking={booking} viewer={viewer} onChanged={reload} />} />
          ))}
        </div>
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}
