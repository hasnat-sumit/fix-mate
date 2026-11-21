import type { ReactNode } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Inbox } from "lucide-react";
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
  onRetry: () => void;
  children: ReactNode;
};

/** Loading, error and empty states around a list. Existing data stays visible while reloading. */
export function DataState({ isLoading, error, isEmpty, emptyTitle, emptyDescription, onRetry, children }: DataStateProps) {
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

const statusTones: Record<string, string> = {
  pending: "bg-warning/15 text-foreground",
  accepted: "bg-information/15 text-foreground",
  in_progress: "bg-accent/15 text-foreground",
  completed: "bg-success/15 text-foreground",
  approved: "bg-success/15 text-foreground",
  active: "bg-success/15 text-foreground",
  paid: "bg-success/15 text-foreground",
  rejected: "bg-error/15 text-foreground",
  suspended: "bg-error/15 text-foreground",
  cancelled: "bg-muted text-muted-foreground",
  unpaid: "bg-muted text-muted-foreground",
};

const dotTones: Record<string, string> = {
  pending: "bg-warning",
  accepted: "bg-information",
  in_progress: "bg-accent",
  completed: "bg-success",
  approved: "bg-success",
  active: "bg-success",
  paid: "bg-success",
  rejected: "bg-error",
  suspended: "bg-error",
  cancelled: "bg-muted-foreground",
  unpaid: "bg-muted-foreground",
};

/** A status pill. The text carries the meaning; colour only reinforces it. */
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", statusTones[status] ?? "bg-muted text-foreground")}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotTones[status] ?? "bg-muted-foreground")} />
      {label ?? formatStatus(status)}
    </span>
  );
}

export const selectClassName =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
