"use client";

import { useState } from "react";
import Link from "next/link";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DataState, PageHeader, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { ServiceForm } from "@/components/dashboard/service-form";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/services-api";
import { cn } from "@/lib/utils";

const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : "Something went wrong. Please try again.");

/** My Services: full CRUD for the technician's own services, plus the availability switch. */
export function TechnicianServices() {
  const { data, error, isLoading, reload } = useApiQuery<Service[]>("/api/services/my");
  const [editing, setEditing] = useState<Service | null>(null);
  const [isEditBusy, setIsEditBusy] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function toggleAvailability(service: Service) {
    setTogglingId(service._id);
    try {
      await apiRequest(`/api/services/${service._id}`, { method: "PATCH", body: { isAvailable: !service.isAvailable } });
      toast.success(service.isAvailable ? "Service hidden from public pages." : "Service is available again.");
      await refreshServiceCatalogCache();
      reload();
    } catch (caught) {
      toast.error(errorMessage(caught));
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/api/services/${toDelete._id}`, { method: "DELETE" });
      toast.success(`“${toDelete.title}” deleted.`);
      setToDelete(null);
      await refreshServiceCatalogCache();
    } catch (caught) {
      toast.error(errorMessage(caught));
    } finally {
      setIsDeleting(false);
      reload();
    }
  }

  const columns: Column<Service>[] = [
    {
      header: "Service",
      className: "min-w-[240px]",
      cell: (service) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <ServiceImage src={service.image} alt="" sizes="64px" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold text-foreground">{service.title}</p>
            <p className="text-xs text-muted-foreground">{service.serviceMode}</p>
          </div>
        </div>
      ),
    },
    { header: "Category", cell: (service) => service.category },
    { header: "Price", cell: (service) => <span className="tabular-nums">{formatPrice(service.basePrice)}</span> },
    { header: "Approval", cell: (service) => <StatusBadge status={service.approvalStatus} /> },
    {
      header: "Available",
      cell: (service) => (
        <AvailabilitySwitch
          checked={service.isAvailable}
          disabled={togglingId === service._id}
          label={`${service.title} available on public pages`}
          onChange={() => toggleAvailability(service)}
        />
      ),
    },
    {
      header: "Actions",
      hideLabelOnMobile: true,
      cell: (service) => (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setEditing(service)} className="h-9 flex-1 rounded-lg px-3 md:flex-none" aria-label={`Edit ${service.title}`}>
            <Pencil aria-hidden="true" className="size-4" /> Edit
          </Button>
          <Button type="button" variant="outline" onClick={() => setToDelete(service)} className="h-9 flex-1 rounded-lg px-3 text-error md:flex-none" aria-label={`Delete ${service.title}`}>
            <Trash2 aria-hidden="true" className="size-4" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="My Services"
        description="Edit, hide or delete your services. Editing sends a service back for admin approval; switching availability off hides it from the public pages."
        actions={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/dashboard/technician/add-service">
              <CirclePlus aria-hidden="true" className="size-4" /> Add Service
            </Link>
          </Button>
        }
      />
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.length === 0}
        emptyTitle="No services yet"
        emptyDescription="Add your first repair service. Customers can find it once an admin approves it."
        emptyAction={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/dashboard/technician/add-service">Add a service</Link>
          </Button>
        }
        onRetry={reload}
      >
        {data ? <DataTable caption="My services" rows={data} columns={columns} rowKey={(service) => service._id} /> : null}
      </DataState>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit service"
        description={editing?.title}
        isBusy={isEditBusy}
      >
        {editing ? (
          <ServiceForm
            key={editing._id}
            service={editing}
            onBusyChange={setIsEditBusy}
            onCancel={() => setEditing(null)}
            onSaved={(saved) => {
              toast.success("Changes saved.", {
                description: saved.approvalStatus === "pending" ? "The service is Pending again until an admin approves it." : undefined,
              });
              setIsEditBusy(false);
              setEditing(null);
              reload();
            }}
          />
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this service?"
        description={
          <>
            <strong className="text-foreground">{toDelete?.title}</strong> will be removed permanently. Past bookings keep their own copy of
            the details. A service with open requests can’t be deleted until they’re finished or rejected.
          </>
        }
        confirmLabel="Delete service"
        destructive
        isBusy={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}

function AvailabilitySwitch({ checked, disabled, label, onChange }: { checked: boolean; disabled: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="inline-flex items-center gap-2 rounded-full text-xs font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
    >
      <span className={cn("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-success" : "bg-muted-foreground/40")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")} />
      </span>
      {checked ? "On" : "Off"}
    </button>
  );
}
