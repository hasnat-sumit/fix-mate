"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, selectClassName, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApiError, apiRequest } from "@/lib/api-client";
import { bookingStatuses, type Booking, type BookingStatus, type Paged } from "@/lib/dashboard-types";
import { formatCalendarDate, formatPrice, formatStatus } from "@/lib/format";

const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : "Something went wrong. Please try again.");

/** My Bookings: every booking of the signed-in customer, with Cancel (while requested) and Pay Now (completed + unpaid). */
export function CustomerBookings() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<Booking>>(`/api/bookings/my?${query.toString()}`);

  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  async function confirmCancel() {
    if (!toCancel) return;
    setIsCancelling(true);
    try {
      await apiRequest(`/api/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      toast.success("Request cancelled.");
      setToCancel(null);
    } catch (caught) {
      toast.error(errorMessage(caught));
    } finally {
      setIsCancelling(false);
      reload();
    }
  }

  /** Starts Stripe Checkout for the booking. The server reads the amount from the booking, never from here. */
  async function payNow(booking: Booking) {
    setPayingId(booking._id);
    try {
      const { url } = await apiRequest<{ url: string }>("/api/payments/create-checkout-session", { method: "POST", body: { bookingId: booking._id } });
      window.location.assign(url);
    } catch (caught) {
      toast.error(errorMessage(caught));
      setPayingId(null);
    }
  }

  const columns: Column<Booking>[] = [
    {
      header: "Service",
      cell: (booking) => (
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            <ServiceImage src={booking.serviceImage} alt="" sizes="48px" />
          </div>
          <div className="min-w-0">
            <Link href={`/services/${booking.serviceId}`} className="line-clamp-2 font-semibold text-foreground underline-offset-4 hover:underline">
              {booking.serviceTitle}
            </Link>
            <p className="text-xs text-muted-foreground">{booking.category}</p>
          </div>
        </div>
      ),
      className: "min-w-[240px]",
    },
    { header: "Technician", cell: (booking) => booking.technicianName },
    { header: "Preferred date", cell: (booking) => <span className="whitespace-nowrap tabular-nums">{formatCalendarDate(booking.preferredDate.slice(0, 10))}</span> },
    {
      header: "Price",
      cell: (booking) =>
        booking.status === "completed" ? (
          <span className="whitespace-nowrap tabular-nums">
            <strong className="text-foreground">{formatPrice(booking.finalAmount)}</strong>
            {booking.finalAmount !== booking.basePrice ? <span className="ml-1 text-xs text-muted-foreground line-through">{formatPrice(booking.basePrice)}</span> : null}
          </span>
        ) : (
          <span className="whitespace-nowrap tabular-nums">from {formatPrice(booking.basePrice)}</span>
        ),
    },
    { header: "Status", cell: (booking) => <StatusBadge status={booking.status} /> },
    { header: "Payment", cell: (booking) => <StatusBadge status={booking.paymentStatus} /> },
    {
      header: "Actions",
      hideLabelOnMobile: true,
      cell: (booking) => {
        if (booking.status === "requested") {
          return (
            <Button type="button" variant="outline" onClick={() => setToCancel(booking)} className="h-9 w-full rounded-lg px-3 text-error md:w-auto">
              <X aria-hidden="true" className="size-4" /> Cancel
            </Button>
          );
        }
        if (booking.status === "completed" && booking.paymentStatus === "unpaid") {
          const isPaying = payingId === booking._id;
          return (
            <Button type="button" onClick={() => payNow(booking)} disabled={payingId !== null} aria-busy={isPaying} className="h-9 w-full rounded-lg px-3 md:w-auto">
              <CreditCard aria-hidden="true" className="size-4" /> {isPaying ? "Opening…" : `Pay Now ${formatPrice(booking.finalAmount)}`}
            </Button>
          );
        }
        if (booking.paymentStatus === "paid") return <StatusBadge status="paid" label="Paid" />;
        return <span className="text-xs text-muted-foreground">—</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Every repair request you’ve sent. Cancel while a request is still Requested; pay once the job is Completed."
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="customer-booking-status" className="text-sm font-semibold text-muted-foreground">
              Status
            </label>
            <select
              id="customer-booking-status"
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
        emptyDescription={status ? "Try another status filter." : "When you request a repair, it appears here so you can follow it step by step."}
        emptyAction={
          status ? null : (
            <Button asChild className="h-11 rounded-full px-5">
              <Link href="/services">Browse services</Link>
            </Button>
          )
        }
        onRetry={reload}
      >
        {data ? <DataTable caption="My bookings" rows={data.items} columns={columns} rowKey={(booking) => booking._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>

      <ConfirmDialog
        open={toCancel !== null}
        onOpenChange={(open) => !open && setToCancel(null)}
        title="Cancel this request?"
        description={
          <>
            Your request for <strong className="text-foreground">{toCancel?.serviceTitle}</strong> will be cancelled and{" "}
            {toCancel?.technicianName} will no longer see it as open. This can’t be undone.
          </>
        }
        confirmLabel="Yes, cancel request"
        destructive
        isBusy={isCancelling}
        onConfirm={confirmCancel}
      />
    </>
  );
}
