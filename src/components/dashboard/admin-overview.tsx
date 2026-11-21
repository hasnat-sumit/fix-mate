"use client";

import Link from "next/link";
import { BadgeCheck, Hourglass, Users, Wrench } from "lucide-react";
import { BarChart, ColumnChart, DataState, PageHeader, StatCard, StatCardsSkeleton } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { bookingStatuses, type AdminStats } from "@/lib/dashboard-types";
import { formatPrice, formatStatus } from "@/lib/format";

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });

export function AdminOverview() {
  const { data, error, isLoading, reload } = useApiQuery<AdminStats>("/api/admin/stats");

  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="Users, services, jobs and revenue across FixMate."
        actions={
          data && data.pendingServices > 0 ? (
            <Button asChild className="h-11 rounded-full px-5">
              <Link href="/dashboard/admin/services">
                <BadgeCheck aria-hidden="true" className="size-4" /> Review {data.pendingServices} pending
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="mt-6">
        {isLoading && !data ? (
          <StatCardsSkeleton />
        ) : (
          <DataState isLoading={isLoading} error={error} isEmpty={!data} emptyTitle="No data yet" emptyDescription="Platform statistics will appear here." onRetry={reload}>
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard label="Total Users" value={data.totalUsers} hint={`${data.usersByRole.customer} customers · ${data.usersByRole.admin} admins`} icon={Users} />
                  <StatCard label="Total Technicians" value={data.totalTechnicians} hint={`${data.servicesByStatus.approved} approved services`} icon={Wrench} />
                  <StatCard label="Pending Services" value={data.pendingServices} hint="Waiting for your approval" icon={Hourglass} />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <ColumnChart
                    title="Revenue, last 6 months"
                    description={`${formatPrice(data.totalRevenue)} from ${data.totalPayments} ${data.totalPayments === 1 ? "payment" : "payments"} in total.`}
                    data={data.revenueByMonth.map((row) => ({ label: monthLabel.format(new Date(`${row.month}-01T00:00:00Z`)), value: row.revenue }))}
                    formatValue={formatPrice}
                  />
                  <BarChart
                    title="Bookings by status"
                    description="Every repair job on the platform, by its current stage."
                    data={bookingStatuses.map((status) => ({ label: formatStatus(status), value: data.bookingsByStatus[status] }))}
                  />
                </div>
              </div>
            ) : null}
          </DataState>
        )}
      </div>
    </>
  );
}
