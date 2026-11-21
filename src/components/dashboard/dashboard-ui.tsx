import { useId, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Inbox, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiError } from "@/lib/api-client";
import { formatStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-[-0.05em] text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

type DataStateProps = {
  isLoading: boolean;
  error: ApiError | undefined;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  /** A call to action in the empty state, e.g. a "Browse services" button. */
  emptyAction?: ReactNode;
  onRetry: () => void;
  children: ReactNode;
};

/** Loading, error and empty states around a list. Existing data stays visible while reloading. */
export function DataState({ isLoading, error, isEmpty, emptyTitle, emptyDescription, emptyAction, onRetry, children }: DataStateProps) {
  if (error && isEmpty) {
    return (
      <div role="alert" className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-error/30 bg-error/10 p-5 text-sm text-foreground">
        <p className="flex items-start gap-2.5">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-error" />
          {error.message}
        </p>
        <Button type="button" variant="outline" onClick={onRetry} className="h-10 rounded-lg px-4">
          Try again
        </Button>
      </div>
    );
  }
  if (isLoading && isEmpty) {
    return (
      <div aria-busy="true" aria-label="Loading" className="mt-6 space-y-4">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-accent">
          <Inbox aria-hidden="true" className="size-6" />
        </span>
        <h2 className="mt-4 font-heading text-lg font-bold text-foreground">{emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
        {emptyAction ? <div className="mt-5">{emptyAction}</div> : null}
      </div>
    );
  }
  return <>{children}</>;
}

export function Pager({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3">
      <Button type="button" variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)} className="h-10 rounded-lg px-3">
        <ArrowLeft aria-hidden="true" className="size-4" /> Previous
      </Button>
      <p className="text-sm tabular-nums text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <Button type="button" variant="outline" disabled={page >= pageCount} onClick={() => onChange(page + 1)} className="h-10 rounded-lg px-3">
        Next <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  );
}

/**
 * Status colours, the same on every dashboard: Requested = blue, Accepted = indigo, In progress = amber,
 * Completed = green, Rejected = red, Cancelled = gray; Paid = green, Unpaid = gray. Approval states reuse them.
 */
const statusTones: Record<string, { pill: string; dot: string }> = {
  requested: { pill: "bg-information/12 text-information ring-information/30", dot: "bg-information" },
  accepted: { pill: "bg-indigo/12 text-indigo ring-indigo/30", dot: "bg-indigo" },
  "in-progress": { pill: "bg-warning/15 text-[color-mix(in_oklch,var(--warning),var(--foreground)_40%)] ring-warning/35", dot: "bg-warning" },
  completed: { pill: "bg-success/12 text-success ring-success/30", dot: "bg-success" },
  rejected: { pill: "bg-error/12 text-error ring-error/30", dot: "bg-error" },
  cancelled: { pill: "bg-muted text-muted-foreground ring-border", dot: "bg-muted-foreground" },
  paid: { pill: "bg-success/12 text-success ring-success/30", dot: "bg-success" },
  unpaid: { pill: "bg-muted text-muted-foreground ring-border", dot: "bg-muted-foreground" },
  pending: { pill: "bg-warning/15 text-[color-mix(in_oklch,var(--warning),var(--foreground)_40%)] ring-warning/35", dot: "bg-warning" },
  approved: { pill: "bg-success/12 text-success ring-success/30", dot: "bg-success" },
  active: { pill: "bg-success/12 text-success ring-success/30", dot: "bg-success" },
  suspended: { pill: "bg-error/12 text-error ring-error/30", dot: "bg-error" },
};

/** A status pill. The text carries the meaning; colour only reinforces it. */
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = statusTones[status] ?? statusTones.cancelled;
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tone.pill)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", tone.dot)} />
      {label ?? formatStatus(status)}
    </span>
  );
}

/** Reusable overview stat card: label, big value, optional hint and icon. */
export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: LucideIcon }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
        <Icon aria-hidden="true" className="size-5" />
      </span>
    </div>
  );
}

export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-[118px] rounded-2xl" />
      ))}
    </div>
  );
}

type BarDatum = { label: string; value: number };

/**
 * Horizontal single-series bar chart: one validated hue (--chart-bar), bars <= 24px with a 4px rounded
 * data end, the value at each tip, a per-bar hover/focus tooltip and a screen-reader table. No legend:
 * the title names the one series.
 */
export function BarChart({ title, description, data, formatValue = String }: { title: string; description?: string; data: BarDatum[]; formatValue?: (value: number) => string }) {
  const max = Math.max(1, ...data.map((datum) => datum.value));
  const titleId = useId();

  return (
    <figure aria-labelledby={titleId} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <figcaption>
        <p id={titleId} className="font-heading text-base font-bold text-foreground">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </figcaption>
      <div aria-hidden="true" className="mt-5 space-y-3">
        {data.map((datum) => (
          <div key={datum.label} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
            <span className="truncate text-sm text-muted-foreground">{datum.label}</span>
            <div className="group/bar relative flex h-7 items-center border-l border-border">
              <div
                className="h-5 max-h-6 rounded-r-[4px] bg-chart-bar transition-[filter] group-hover/bar:brightness-110"
                style={{ width: datum.value > 0 ? `max(${(datum.value / max) * 100}% - 40px, 4px)` : 0 }}
              />
              <span className="ml-2 text-sm font-semibold tabular-nums text-foreground">{formatValue(datum.value)}</span>
              <span className="pointer-events-none absolute -top-9 left-0 z-10 hidden whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md group-hover/bar:block">
                <strong className="font-semibold text-foreground tabular-nums">{formatValue(datum.value)}</strong>{" "}
                <span className="text-muted-foreground">{datum.label}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.label}>
              <th scope="row">{datum.label}</th>
              <td>{formatValue(datum.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/**
 * Vertical columns for change over time (e.g. revenue per month): same single validated hue and mark specs
 * as BarChart, columns <= 24px wide with a 4px rounded cap, the value on each cap, a hover tooltip and a
 * screen-reader table.
 */
export function ColumnChart({ title, description, data, formatValue = String }: { title: string; description?: string; data: BarDatum[]; formatValue?: (value: number) => string }) {
  const max = Math.max(1, ...data.map((datum) => datum.value));
  const titleId = useId();

  return (
    <figure aria-labelledby={titleId} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <figcaption>
        <p id={titleId} className="font-heading text-base font-bold text-foreground">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </figcaption>
      <div aria-hidden="true" className="mt-6 flex h-52 items-stretch gap-2 border-b border-border">
        {data.map((datum) => (
          <div key={datum.label} className="group/col relative flex flex-1 flex-col items-center justify-end">
            <span className="mb-1.5 text-xs font-semibold tabular-nums text-foreground">{formatValue(datum.value)}</span>
            <div
              className="w-full max-w-6 rounded-t-[4px] bg-chart-bar transition-[filter] group-hover/col:brightness-110"
              style={{ height: datum.value > 0 ? `max(calc((100% - 28px) * ${datum.value / max}), 4px)` : 0 }}
            />
            <span className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md group-hover/col:block">
              <strong className="font-semibold tabular-nums text-foreground">{formatValue(datum.value)}</strong> <span className="text-muted-foreground">{datum.label}</span>
            </span>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-2">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 truncate text-center text-xs text-muted-foreground">
            {datum.label}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.label}>
              <th scope="row">{datum.label}</th>
              <td>{formatValue(datum.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export const selectClassName =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
