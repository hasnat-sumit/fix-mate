"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DataState, PageHeader } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { bookingStatuses, type AdminStats } from "@/lib/dashboard-types";
import { formatPrice, formatStatus } from "@/lib/format";

function Stat({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">{value}</dd>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export function AdminOverview() {
  const { data, error, isLoading, reload } = useApiQuery<AdminStats>("/api/admin/stats");

  return (
    <>
      <PageHeader title="Overview" description="Live counts from the FixMate database." />
      <DataState isLoading={isLoading} error={error} isEmpty={!data} emptyTitle="" emptyDescription="" onRetry={reload}>
        {data ? (
          <div className="mt-6 space-y-8">
            {data.services.pending > 0 ? (
              <Link
                href="/dashboard/admin/services"
                className="flex items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm font-semibold text-foreground transition-colors hover:bg-warning/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {data.services.pending} {data.services.pending === 1 ? "service is" : "services are"} waiting for approval
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </Link>
            ) : null}

            <section aria-labelledby="stats-users">
              <h2 id="stats-users" className="font-heading text-lg font-bold text-foreground">People</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Stat label="Customers" value={data.users.customer} />
                <Stat label="Technicians" value={data.users.technician} />
                <Stat label="Admins" value={data.users.admin} />
                <Stat label="Suspended" value={data.users.suspended} />
              </dl>
            </section>

            <section aria-labelledby="stats-services">
              <h2 id="stats-services" className="font-heading text-lg font-bold text-foreground">Services</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Stat label="Approved" value={data.services.approved} />
                <Stat label="Awaiting approval" value={data.services.pending} />
                <Stat label="Rejected" value={data.services.rejected} />
              </dl>
            </section>

            <section aria-labelledby="stats-bookings">
              <h2 id="stats-bookings" className="font-heading text-lg font-bold text-foreground">Bookings</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-3">
                {bookingStatuses.map((status) => (
                  <Stat key={status} label={formatStatus(status)} value={data.bookings[status]} />
                ))}
              </dl>
            </section>

            <section aria-labelledby="stats-revenue">
              <h2 id="stats-revenue" className="font-heading text-lg font-bold text-foreground">Revenue</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Stat
                  label="Collected"
                  value={formatPrice(data.revenue.amount)}
                  detail={`${data.revenue.payments} paid ${data.revenue.payments === 1 ? "booking" : "bookings"}`}
                />
              </dl>
            </section>
          </div>
        ) : null}
      </DataState>
    </>
  );
}
