"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, Pager, selectClassName, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import type { ApprovalStatus, Paged } from "@/lib/dashboard-types";
import { formatPrice, formatStatus } from "@/lib/format";
import type { Service } from "@/lib/services-api";

const approvalFilters: ApprovalStatus[] = ["pending", "approved", "rejected"];
const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : "Something went wrong. Please try again.");

/** Service Approval: every technician's services, pending first, with Approve / Reject. */
export function AdminServices() {
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | "">("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({ page: String(page), ...(approvalStatus ? { approvalStatus } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<Service>>(`/api/admin/services?${query.toString()}`);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toReject, setToReject] = useState<Service | null>(null);

  async function setApproval(service: Service, next: "approved" | "rejected") {
    setBusyId(service._id);
    try {
      await apiRequest(`/api/admin/services/${service._id}/approval`, { method: "PATCH", body: { approvalStatus: next } });
      toast.success(next === "approved" ? `“${service.title}” approved. It’s now on the public pages.` : `“${service.title}” rejected.`);
      await refreshServiceCatalogCache();
      return true;
    } catch (caught) {
      toast.error(errorMessage(caught));
      return false;
    } finally {
      setBusyId(null);
      reload();
    }
  }

  const columns: Column<Service>[] = [
    {
      header: "Service",
      className: "min-w-[260px]",
      cell: (service) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <ServiceImage src={service.image} alt="" sizes="64px" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold text-foreground">{service.title}</p>
            <p className="text-xs text-muted-foreground">
              {service.category} · {service.serviceMode}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Technician",
      className: "min-w-[180px]",
      cell: (service) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground">{service.technicianName}</p>
          <p className="truncate text-xs text-muted-foreground">{service.technicianEmail}</p>
        </div>
      ),
    },
    { header: "Price", cell: (service) => <span className="tabular-nums">{formatPrice(service.basePrice)}</span> },
    {
      header: "Status",
      cell: (service) => (
        <div className="flex flex-col items-end gap-1 md:items-start">
          <StatusBadge status={service.approvalStatus} />
          {!service.isAvailable ? <span className="text-xs text-muted-foreground">Hidden by technician</span> : null}
        </div>
      ),
    },
    {
      header: "Actions",
      hideLabelOnMobile: true,
      cell: (service) => {
        const isBusy = busyId === service._id;
        return (
          <div className="flex gap-2">
            {service.approvalStatus !== "approved" ? (
              <Button type="button" disabled={isBusy} onClick={() => setApproval(service, "approved")} className="h-9 flex-1 rounded-lg px-3 md:flex-none">
                <Check aria-hidden="true" className="size-4" /> Approve
              </Button>
            ) : null}
            {service.approvalStatus !== "rejected" ? (
              <Button type="button" variant="outline" disabled={isBusy} onClick={() => setToReject(service)} className="h-9 flex-1 rounded-lg px-3 text-error md:flex-none">
                <X aria-hidden="true" className="size-4" /> Reject
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Service Approval"
        description="Services from every technician. Pending services are listed first; only approved, available services appear on the public pages."
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="admin-approval-status" className="text-sm font-semibold text-muted-foreground">
              Approval
            </label>
            <select
              id="admin-approval-status"
              value={approvalStatus}
              onChange={(event) => {
                setApprovalStatus(event.target.value as ApprovalStatus | "");
                setPage(1);
              }}
              className={selectClassName}
            >
              <option value="">All (pending first)</option>
              {approvalFilters.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <p aria-live="polite" className="mt-4 text-sm tabular-nums text-muted-foreground">
        {data ? `${data.total} ${data.total === 1 ? "service" : "services"}` : ""}
      </p>
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.items.length === 0}
        emptyTitle={approvalStatus ? `No ${approvalStatus} services` : "No services yet"}
        emptyDescription={approvalStatus === "pending" ? "You’re all caught up. New and edited services will appear here." : "Services appear here when technicians add them."}
        onRetry={reload}
      >
        {data ? <DataTable caption="Services" rows={data.items} columns={columns} rowKey={(service) => service._id} /> : null}
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>

      <ConfirmDialog
        open={toReject !== null}
        onOpenChange={(open) => !open && setToReject(null)}
        title="Reject this service?"
        description={
          <>
            <strong className="text-foreground">{toReject?.title}</strong> by {toReject?.technicianName} won’t appear on the public pages. The technician can edit
            it to resubmit.
          </>
        }
        confirmLabel="Reject service"
        cancelLabel="Cancel"
        destructive
        isBusy={toReject !== null && busyId === toReject._id}
        onConfirm={async () => {
          if (toReject && (await setApproval(toReject, "rejected"))) setToReject(null);
        }}
      />
    </>
  );
}
