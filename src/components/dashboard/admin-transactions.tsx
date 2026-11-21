"use client";

import { useState } from "react";
import { DollarSign, Receipt } from "lucide-react";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, StatCard, StatCardsSkeleton } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import type { Payment, PaymentsWithRevenue } from "@/lib/dashboard-types";
import { formatDateTime, formatPrice } from "@/lib/format";

const columns: Column<Payment>[] = [
  { header: "Customer", cell: (payment) => <span className="font-semibold text-foreground">{payment.customerName}</span> },
  { header: "Technician", cell: (payment) => payment.technicianName },
  { header: "Service", className: "min-w-[180px]", cell: (payment) => <span className="line-clamp-2">{payment.serviceTitle}</span> },
  { header: "Amount", cell: (payment) => <strong className="tabular-nums text-foreground">{formatPrice(payment.amount)}</strong> },
  { header: "Transaction ID", cell: (payment) => <code className="break-all rounded bg-secondary px-1.5 py-0.5 text-xs">{payment.transactionId}</code> },
  { header: "Payment date", cell: (payment) => <span className="whitespace-nowrap tabular-nums">{formatDateTime(payment.paidAt)}</span> },
];

/** Transactions: every document in the payments collection, with the total revenue above the table. */
export function AdminTransactions() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, reload } = useApiQuery<PaymentsWithRevenue>(`/api/admin/payments?page=${page}`);

  return (
    <>
      <PageHeader title="Transactions" description="Every payment made through Stripe, newest first." />
      <div className="mt-6">
        {isLoading && !data ? (
          <StatCardsSkeleton count={2} />
        ) : data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Revenue" value={formatPrice(data.totalRevenue)} hint="Across all paid jobs" icon={DollarSign} />
            <StatCard label="Payments" value={data.total} hint="Completed Stripe payments" icon={Receipt} />
          </div>
        ) : null}
      </div>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle="No transactions yet"
        emptyDescription="Payments appear here after customers pay for completed jobs."
        onRetry={reload}
      >
        {data ? <DataTable caption="Transactions" rows={data.items} columns={columns} rowKey={(payment) => payment._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}
