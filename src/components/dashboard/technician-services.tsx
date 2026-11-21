"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { DataState, PageHeader, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { ServiceForm } from "@/components/dashboard/service-form";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import type { OwnerService } from "@/lib/dashboard-types";
import { formatPrice } from "@/lib/format";

/** The technician's services: add, edit, hide or show, and delete. */
export function TechnicianServices() {
  const { data, error, isLoading, reload } = useApiQuery<OwnerService[]>("/api/services/mine");
  // "new" for the add form, a service ID for editing, or null.
  const [editing, setEditing] = useState<string | null>(null);

  async function afterChange() {
    setEditing(null);
    reload();
    await refreshServiceCatalogCache();
  }

  const editingService = data?.find((service) => service.id === editing);

  return (
    <>
      <PageHeader
        title="My services"
        description="Services you offer on FixMate. New and edited services are reviewed by an admin before they appear publicly."
        actions={
          editing === null ? (
            <Button type="button" onClick={() => setEditing("new")} className="h-11 rounded-lg px-4">
              <Plus aria-hidden="true" className="size-4" /> Add a service
            </Button>
          ) : null
        }
      />
      {editing === "new" ? (
        <div className="mt-6">
          <ServiceForm onSaved={afterChange} onCancel={() => setEditing(null)} />
        </div>
      ) : null}
      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!data || data.length === 0}
        emptyTitle="No services yet"
        emptyDescription="Add your first service. Customers can request it once an admin approves it."
        onRetry={reload}
      >
        <ul className="mt-6 space-y-4">
          {data?.map((service) =>
            service.id === editing && editingService ? (
              <li key={service.id}>
                <ServiceForm service={editingService} onSaved={afterChange} onCancel={() => setEditing(null)} />
              </li>
            ) : (
              <li key={service.id}>
                <ServiceRow service={service} isLocked={editing !== null} onEdit={() => setEditing(service.id)} onChanged={afterChange} />
              </li>
            ),
          )}
        </ul>
      </DataState>
    </>
  );
}

type ServiceRowProps = { service: OwnerService; isLocked: boolean; onEdit: () => void; onChanged: () => Promise<void> };

function ServiceRow({ service, isLocked, onEdit, onChanged }: ServiceRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPublic = service.approvalStatus === "approved" && service.isActive;

  async function run(request: () => Promise<unknown>) {
    setIsBusy(true);
    setError(null);
    try {
      await request();
      await onChanged();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setIsBusy(false);
      setConfirmDelete(false);
    }
  }

  return (
    <article aria-label={service.title} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:p-5">
      <div className="relative h-36 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-40">
        <ServiceImage src={service.image} alt="" sizes="160px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">{service.category}</p>
            <h2 className="mt-1 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">{service.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={service.approvalStatus} label={service.approvalStatus === "pending" ? "Awaiting approval" : undefined} />
            {!service.isActive ? <StatusBadge status="cancelled" label="Hidden" /> : null}
            {service.isFeatured ? <StatusBadge status="accepted" label="Featured" /> : null}
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
        <p className="mt-2 text-sm text-foreground/85">
          From <span className="font-semibold tabular-nums">{formatPrice(service.price)}</span>
          {service.reviewCount > 0 ? ` · ${service.ratingAverage.toFixed(1)} from ${service.reviewCount} ${service.reviewCount === 1 ? "review" : "reviews"}` : ""}
        </p>
        {service.approvalStatus === "rejected" && service.rejectionReason ? (
          <p className="mt-3 rounded-xl border border-error/30 bg-error/10 p-3 text-sm leading-6 text-foreground">
            <span className="font-semibold">Not approved:</span> {service.rejectionReason} Edit the service to resubmit it.
          </p>
        ) : null}
        {error ? (
          <div className="mt-3">
            <FormAlert>{error}</FormAlert>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {confirmDelete ? (
            <>
              <p className="w-full text-sm text-foreground">
                Delete “{service.title}”? Services with booking history are hidden instead, so past bookings keep their details.
              </p>
              <Button type="button" variant="destructive" disabled={isBusy} onClick={() => run(() => apiRequest(`/api/services/${service.id}`, { method: "DELETE" }))} className="h-10 rounded-lg px-4">
                {isBusy ? "Deleting…" : "Yes, delete"}
              </Button>
              <Button type="button" variant="outline" disabled={isBusy} onClick={() => setConfirmDelete(false)} className="h-10 rounded-lg px-4">
                Keep it
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" disabled={isLocked || isBusy} onClick={onEdit} className="h-10 rounded-lg px-4">
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLocked || isBusy}
                onClick={() => run(() => apiRequest(`/api/services/${service.id}`, { method: "PATCH", body: { isActive: !service.isActive } }))}
                className="h-10 rounded-lg px-4"
              >
                {service.isActive ? "Hide from customers" : "Show to customers"}
              </Button>
              <Button type="button" variant="ghost" disabled={isLocked || isBusy} onClick={() => setConfirmDelete(true)} className="h-10 rounded-lg px-4 text-error hover:text-error">
                Delete
              </Button>
              {isPublic ? (
                <Button asChild variant="link" className="h-10 px-2">
                  <Link href={`/services/${service.id}`}>View public page</Link>
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
