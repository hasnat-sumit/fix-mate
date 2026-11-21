"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CircleCheckBig, Play, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, selectClassName, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { Booking, BookingStatus, Paged } from "@/lib/dashboard-types";
import { formatCalendarDate, formatPrice, formatStatus } from "@/lib/format";

const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
const statusFilters: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];
const successMessages: Partial<Record<BookingStatus, string>> = {
  accepted: "Request accepted.",
  rejected: "Request rejected.",
  "in-progress": "Work started. The job is now In Progress.",
  completed: "Job marked completed. The customer can now pay.",
};

/** Manage Requests: the technician's jobs, with only the valid next action for each status. */
export function TechnicianRequests() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<Booking>>(`/api/bookings/technician?${query.toString()}`);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [toReject, setToReject] = useState<Booking | null>(null);
  const [toComplete, setToComplete] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();

  async function changeStatus(booking: Booking, next: BookingStatus, extra: Record<string, unknown> = {}) {
    setBusyId(booking._id);
    try {
      await apiRequest(`/api/bookings/${booking._id}/status`, { method: "PATCH", body: { status: next, ...extra } });
      toast.success(successMessages[next] ?? "Status updated.");
      return true;
    } catch (caught) {
      toast.error(errorMessage(caught));
      return false;
    } finally {
      setBusyId(null);
      reload();
    }
  }

  function openComplete(booking: Booking) {
    setToComplete(booking);
    setFinalAmount(String(booking.basePrice));
    setAmountError(undefined);
  }

  async function confirmComplete() {
    if (!toComplete) return;
    const amount = /^\d+(\.\d{1,2})?$/.test(finalAmount.trim()) ? Number(finalAmount) : Number.NaN;
    if (Number.isNaN(amount) || amount <= 0) {
      setAmountError("Enter an amount greater than 0, with at most two decimals.");
      document.getElementById("final-amount")?.focus();
      return;
    }
    if (await changeStatus(toComplete, "completed", { finalAmount: amount })) setToComplete(null);
  }

  const columns: Column<Booking>[] = [
    {
      header: "Customer",
      className: "min-w-[170px]",
      cell: (booking) => (
        <div>
          <p className="font-semibold text-foreground">{booking.customerName}</p>
          <a href={`tel:${booking.customerPhone.replace(/[^\d+]/g, "")}`} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            {booking.customerPhone}
          </a>
        </div>
      ),
    },
    { header: "Service", className: "min-w-[180px]", cell: (booking) => <span className="line-clamp-2">{booking.serviceTitle}</span> },
    { header: "Address", className: "min-w-[180px]", cell: (booking) => <span className="line-clamp-2">{booking.address}</span> },
    { header: "Preferred date", cell: (booking) => <span className="whitespace-nowrap tabular-nums">{formatCalendarDate(booking.preferredDate.slice(0, 10))}</span> },
    {
      header: "Problem",
      className: "min-w-[220px] max-w-[280px]",
      cell: (booking) => (
        <p title={booking.problemDescription} className="line-clamp-3 text-left text-sm">
          {booking.problemDescription}
        </p>
      ),
    },
    {
      header: "Status",
      cell: (booking) => (
        <div className="flex flex-col items-end gap-1 md:items-start">
          <StatusBadge status={booking.status} />
          {booking.status === "completed" ? <StatusBadge status={booking.paymentStatus} /> : null}
        </div>
      ),
    },
    {
      header: "Actions",
      hideLabelOnMobile: true,
      cell: (booking) => {
        const isBusy = busyId === booking._id;
        switch (booking.status) {
          case "requested":
            return (
              <div className="flex gap-2">
                <Button type="button" disabled={isBusy} onClick={() => changeStatus(booking, "accepted")} className="h-9 flex-1 rounded-lg px-3 md:flex-none">
                  <Check aria-hidden="true" className="size-4" /> Accept
                </Button>
                <Button type="button" variant="outline" disabled={isBusy} onClick={() => setToReject(booking)} className="h-9 flex-1 rounded-lg px-3 text-error md:flex-none">
                  <X aria-hidden="true" className="size-4" /> Reject
                </Button>
              </div>
            );
          case "accepted":
            return (
              <Button type="button" disabled={isBusy} onClick={() => changeStatus(booking, "in-progress")} className="h-9 w-full rounded-lg px-3 md:w-auto">
                <Play aria-hidden="true" className="size-4" /> Start Work
              </Button>
            );
          case "in-progress":
            return (
              <Button type="button" disabled={isBusy} onClick={() => openComplete(booking)} className="h-9 w-full rounded-lg px-3 md:w-auto">
                <CircleCheckBig aria-hidden="true" className="size-4" /> Mark Completed
              </Button>
            );
          case "completed":
            return <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-foreground">{formatPrice(booking.finalAmount)}</span>;
          default:
            return <span className="text-xs text-muted-foreground">No action</span>;
        }
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Manage Requests"
        description="Requests for your services. Accept or reject new requests, start the work, then mark the job completed with the final amount."
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="technician-request-status" className="text-sm font-semibold text-muted-foreground">
              Status
            </label>
            <select
              id="technician-request-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BookingStatus | "");
                setPage(1);
              }}
              className={selectClassName}
            >
              <option value="">All</option>
              {statusFilters.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "request" : "requests"}` : ""}
      </p>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle={status ? `No ${formatStatus(status).toLowerCase()} requests` : "No requests yet"}
        emptyDescription={status ? "Try another status filter." : "When customers request your approved services, their jobs appear here."}
        emptyAction={
          status ? (
            <Button type="button" variant="outline" onClick={() => setStatus("")} className="h-11 rounded-full px-5">
              Show all requests
            </Button>
          ) : (
            <Button asChild className="h-11 rounded-full px-5">
              <Link href="/dashboard/technician/my-services">Review my services</Link>
            </Button>
          )
        }
        onRetry={reload}
      >
        {data ? <DataTable caption="Repair requests" rows={data.items} columns={columns} rowKey={(booking) => booking._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>

      <ConfirmDialog
        open={toReject !== null}
        onOpenChange={(open) => !open && setToReject(null)}
        title="Reject this request?"
        description={
          <>
            <strong className="text-foreground">{toReject?.customerName}</strong>’s request for {toReject?.serviceTitle} will be rejected. This is final and can’t
            be undone.
          </>
        }
        confirmLabel="Reject request"
        destructive
        isBusy={toReject !== null && busyId === toReject._id}
        onConfirm={async () => {
          if (toReject && (await changeStatus(toReject, "rejected"))) setToReject(null);
        }}
      />

      <ConfirmDialog
        open={toComplete !== null}
        onOpenChange={(open) => !open && setToComplete(null)}
        title="Mark job completed"
        description={
          <>
            Enter the final amount for <strong className="text-foreground">{toComplete?.serviceTitle}</strong>. The customer pays this amount after you
            confirm.
          </>
        }
        confirmLabel="Mark completed"
        cancelLabel="Back"
        isBusy={toComplete !== null && busyId === toComplete._id}
        onConfirm={confirmComplete}
      >
        <FormField id="final-amount" label="Final amount (USD)" error={amountError} hint={toComplete ? `Base price: ${formatPrice(toComplete.basePrice)}` : undefined}>
          <Input
            id="final-amount"
            inputMode="decimal"
            value={finalAmount}
            onChange={(event) => {
              setFinalAmount(event.target.value);
              setAmountError(undefined);
            }}
            aria-invalid={Boolean(amountError)}
            aria-describedby={describedBy("final-amount", amountError, true)}
            className="h-11 bg-background"
          />
        </FormField>
      </ConfirmDialog>
    </>
  );
}
