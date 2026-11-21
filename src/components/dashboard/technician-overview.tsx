"use client";

import Link from "next/link";
import { BadgeCheck, CirclePlus, Inbox, Wrench } from "lucide-react";
import { BarChart, DataState, PageHeader, StatCard, StatCardsSkeleton } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { bookingStatuses, type TechnicianStats } from "@/lib/dashboard-types";
import { formatPrice, formatStatus } from "@/lib/format";

export function TechnicianOverview() {
  const { data: session } = authClient.useSession();
  const { data, error, isLoading, reload } = useApiQuery<TechnicianStats>("/api/bookings/technician/stats");
  const firstName = session?.user.name.split(" ")[0];
  const totalJobs = data ? Object.values(data.byStatus).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Overview"}
        description="Your services and incoming requests at a glance."
        actions={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/dashboard/technician/add-service">
              <CirclePlus aria-hidden="true" className="size-4" /> Add Service
            </Link>
          </Button>
        }
      />

      <div className="mt-6">
        {isLoading && !data ? (
          <StatCardsSkeleton />
        ) : (
          <DataState isLoading={isLoading} error={error} isEmpty={!data} emptyTitle="No data yet" emptyDescription="Your statistics will appear here." onRetry={reload}>
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard label="Total Services" value={data.totalServices} hint="In every approval state" icon={Wrench} />
                  <StatCard label="Approved Services" value={data.approvedServices} hint="Eligible for the public pages" icon={BadgeCheck} />
                  <StatCard label="Pending Requests" value={data.pendingRequests} hint={`${formatPrice(data.totalEarned)} earned from paid jobs`} icon={Inbox} />
                </div>
                {totalJobs > 0 ? (
                  <BarChart
                    title="Your jobs by status"
                    description="Every request you’ve received, by its current stage."
                    data={bookingStatuses.map((status) => ({ label: formatStatus(status), value: data.byStatus[status] }))}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
                    <p className="font-heading text-lg font-bold text-foreground">No requests yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {data.approvedServices > 0
                        ? "Customers can now request your approved services. New requests will show up here."
                        : "Add a service and wait for admin approval. Customers can request it once it’s approved."}
                    </p>
                  </div>
                )}
                {data.pendingRequests > 0 ? (
                  <Link href="/dashboard/technician/requests" className="inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
                    Review {data.pendingRequests} new {data.pendingRequests === 1 ? "request" : "requests"} →
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
