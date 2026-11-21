"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import type { Paged, Payment } from "@/lib/dashboard-types";
import { formatDateTime, formatPrice } from "@/lib/format";
import { myBookingsHref } from "@/lib/navigation";

const columns: Column<Payment>[] = [
  { header: "Service", cell: (payment) => <span className="font-semibold text-foreground">{payment.serviceTitle}</span>, className: "min-w-[200px]" },
  { header: "Technician", cell: (payment) => payment.technicianName },
  { header: "Amount", cell: (payment) => <strong className="tabular-nums text-foreground">{formatPrice(payment.amount)}</strong> },
  { header: "Transaction ID", cell: (payment) => <code className="break-all rounded bg-secondary px-1.5 py-0.5 text-xs">{payment.transactionId}</code> },
  { header: "Payment date", cell: (payment) => <span className="whitespace-nowrap tabular-nums">{formatDateTime(payment.paidAt)}</span> },
];

/** Payment History: the customer's documents from the payments collection, newest first. */
export function CustomerPayments() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, reload } = useApiQuery<Paged<Payment>>(`/api/payments/my?page=${page}`);

  return (
    <>
      <PageHeader title="Payment History" description="Payments you’ve made for completed jobs, newest first." />
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "payment" : "payments"}` : ""}
      </p>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle="No payments yet"
        emptyDescription="You pay for a job only after the technician marks it completed. Completed jobs waiting for payment are in My Bookings."
        emptyAction={
          <Button asChild variant="outline" className="h-11 rounded-full px-5">
            <Link href={myBookingsHref}>Go to My Bookings</Link>
          </Button>
        }
        onRetry={reload}
      >
        {data ? <DataTable caption="Payment history" rows={data.items} columns={columns} rowKey={(payment) => payment._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}
