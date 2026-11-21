"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { DataState, PageHeader, Pager, StatusBadge, selectClassName } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import type { AdminService, ApprovalStatus, Paged } from "@/lib/dashboard-types";
import { formatDateTime, formatPrice } from "@/lib/format";

const filters: { value: ApprovalStatus | ""; label: string }[] = [
  { value: "pending", label: "Awaiting approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All services" },
];

/** The approval queue (oldest first) plus every other service, with approve, reject and feature controls. */
export function AdminServices() {
  const [status, setStatus] = useState<ApprovalStatus | "">("pending");
  const [page, setPage] = useState(1);
  const search = new URLSearchParams({ page: String(page), ...(status ? { approvalStatus: status } : {}) });
  const { data, error, isLoading, reload } = useApiQuery<Paged<AdminService>>(`/api/admin/services?${search.toString()}`);

  async function afterChange() {
    reload();
    await refreshServiceCatalogCache();
  }

  return (
    <>
      <PageHeader
        title="Service approvals"
        description="Review new and edited services before they go public. The oldest submissions are listed first."
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="admin-service-filter" className="text-sm font-semibold text-muted-foreground">
              Show
            </label>
            <select
              id="admin-service-filter"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as ApprovalStatus | "");
                setPage(1);
              }}
              className={selectClassName}
            >
              {filters.map((filter) => (
                <option key={filter.label} value={filter.value}>
                  {filter.label}
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
        emptyTitle={status === "pending" ? "Nothing waiting for approval" : "No services here"}
        emptyDescription={status === "pending" ? "New and edited services will appear here for review." : "Try another filter."}
        onRetry={reload}
      >
        <ul className="mt-4 space-y-4">
          {data?.items.map((service) => (
            <li key={service.id}>
              <AdminServiceCard service={service} onChanged={afterChange} />
            </li>
          ))}
        </ul>
        {data ? <Pager page={data.page} pageCount={data.pageCount} onChange={setPage} /> : null}
      </DataState>
    </>
  );
}

function AdminServiceCard({ service, onChanged }: { service: AdminService; onChanged: () => Promise<void> }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const reasonId = `reject-${service.id}`;

  async function run(request: () => Promise<unknown>) {
    setIsBusy(true);
    setError(null);
    try {
      await request();
      setIsRejecting(false);
      await onChanged();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  function submitRejection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) {
      setReasonError("Add a reason the technician can act on.");
      document.getElementById(reasonId)?.focus();
      return;
    }
    void run(() => apiRequest(`/api/admin/services/${service.id}/approval`, { method: "PATCH", body: { status: "rejected", reason: reason.trim() } }));
  }

  return (
    <article aria-label={service.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-48">
          <ServiceImage src={service.image} alt={`Image for ${service.title}`} sizes="192px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">{service.category}</p>
              <h2 className="mt-1 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">{service.title}</h2>
              <p className="mt-0.5 break-all text-sm text-muted-foreground">
                {service.technician.name} · {service.technician.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={service.approvalStatus} label={service.approvalStatus === "pending" ? "Awaiting approval" : undefined} />
              {!service.isActive ? <StatusBadge status="cancelled" label="Hidden by technician" /> : null}
              {service.isFeatured ? <StatusBadge status="accepted" label="Featured" /> : null}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-foreground/85">{service.description}</p>
          <p className="mt-1 text-sm text-foreground/85">
            From <span className="font-semibold tabular-nums">{formatPrice(service.price)}</span> · Updated{" "}
            <time dateTime={service.updatedAt}>{formatDateTime(service.updatedAt)}</time>
          </p>
        </div>
      </div>

      {service.details || service.includes.length > 0 || service.availability ? (
        <details className="mt-4">
          <summary className="cursor-pointer rounded text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Full details</summary>
          <div className="mt-3 space-y-2 text-sm leading-6 text-foreground/85">
            {service.details ? <p className="whitespace-pre-line">{service.details}</p> : null}
            {service.includes.length > 0 ? (
              <ul className="list-disc pl-5">
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {service.availability ? <p>Availability: {service.availability}</p> : null}
            <p className="break-all text-muted-foreground">Image: {service.image}</p>
          </div>
        </details>
      ) : null}

      {service.approvalStatus === "rejected" && service.rejectionReason ? (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Rejection reason:</span> {service.rejectionReason}
        </p>
      ) : null}
      {error ? (
        <div className="mt-3">
          <FormAlert>{error}</FormAlert>
        </div>
      ) : null}

      <div className="mt-4 border-t border-border pt-4">
        {isRejecting ? (
          <form noValidate onSubmit={submitRejection} aria-label={`Reject ${service.title}`} className="space-y-3">
            <div>
              <Label htmlFor={reasonId} className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Reason (shown to the technician)
              </Label>
              <Textarea
                id={reasonId}
                autoFocus
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setReasonError(null);
                }}
                aria-invalid={Boolean(reasonError)}
                aria-describedby={reasonError ? `${reasonId}-error` : undefined}
                className="bg-background"
              />
              {reasonError ? (
                <p id={`${reasonId}-error`} className="mt-1.5 text-xs font-medium text-error">
                  {reasonError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="destructive" disabled={isBusy} className="h-10 rounded-lg px-4">
                {isBusy ? "Saving…" : "Reject service"}
              </Button>
              <Button type="button" variant="outline" disabled={isBusy} onClick={() => setIsRejecting(false)} className="h-10 rounded-lg px-4">
                Back
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap gap-2">
            {service.approvalStatus !== "approved" ? (
              <Button
                type="button"
                disabled={isBusy}
                onClick={() => run(() => apiRequest(`/api/admin/services/${service.id}/approval`, { method: "PATCH", body: { status: "approved" } }))}
                className="h-10 rounded-lg px-4"
              >
                Approve
              </Button>
            ) : null}
            {service.approvalStatus !== "rejected" ? (
              <Button type="button" variant="outline" disabled={isBusy} onClick={() => setIsRejecting(true)} className="h-10 rounded-lg px-4">
                Reject
              </Button>
            ) : null}
            {service.approvalStatus === "approved" ? (
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={() => run(() => apiRequest(`/api/admin/services/${service.id}/featured`, { method: "PATCH", body: { isFeatured: !service.isFeatured } }))}
                className="h-10 rounded-lg px-4"
              >
                {service.isFeatured ? "Remove from featured" : "Feature on homepage"}
              </Button>
            ) : null}
            {service.approvalStatus === "approved" && service.isActive ? (
              <Button asChild variant="link" className="h-10 px-2">
                <Link href={`/services/${service.id}`}>View public page</Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
