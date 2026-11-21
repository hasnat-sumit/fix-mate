"use client";

import Link from "next/link";
import { CircleCheckBig, ClipboardList, Hammer, Search } from "lucide-react";
import { BarChart, DataState, PageHeader, StatCard, StatCardsSkeleton } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { bookingStatuses, type CustomerStats } from "@/lib/dashboard-types";
import { formatPrice, formatStatus } from "@/lib/format";
import { myBookingsHref } from "@/lib/navigation";

export function CustomerOverview() {
  const { data: session } = authClient.useSession();
  const { data, error, isLoading, reload } = useApiQuery<CustomerStats>("/api/bookings/my/stats");
  const firstName = session?.user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Overview"}
        description="Your repair requests at a glance."
        actions={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/services">
              <Search aria-hidden="true" className="size-4" /> Find a service
            </Link>
          </Button>
        }
      />

      <div className="mt-6">
        {isLoading && !data ? (
          <StatCardsSkeleton />
        ) : (
          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={!data}
            emptyTitle="No data yet"
            emptyDescription="Your statistics will appear here."
            onRetry={reload}
          >
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard label="Total Requests" value={data.totalRequests} hint="Every request you’ve sent" icon={ClipboardList} />
                  <StatCard label="Active Jobs" value={data.activeJobs} hint="Requested, accepted or in progress" icon={Hammer} />
                  <StatCard label="Completed Jobs" value={data.completedJobs} hint={`${formatPrice(data.totalPaid)} paid so far`} icon={CircleCheckBig} />
                </div>
                {data.totalRequests > 0 ? (
                  <BarChart
                    title="Your requests by status"
                    description="How many of your repair requests are in each stage."
                    data={bookingStatuses.map((status) => ({ label: formatStatus(status), value: data.byStatus[status] }))}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
                    <p className="font-heading text-lg font-bold text-foreground">No repair requests yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">Find a technician for your device or appliance and send your first request.</p>
                    <Button asChild className="mt-5 h-11 rounded-full px-5">
                      <Link href="/services">Browse services</Link>
                    </Button>
                  </div>
                )}
                {data.totalRequests > 0 ? (
                  <Link href={myBookingsHref} className="inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
                    View all my bookings →
                  </Link>
                ) : null}
              </div>
            ) : null}
          </DataState>
        )}
      </div>
    </>
  );
}
