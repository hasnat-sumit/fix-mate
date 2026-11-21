import { Check, CircleDashed, X } from "lucide-react";
import type { Booking } from "@/lib/dashboard-types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type StepKey = Booking["statusHistory"][number]["status"];

const happyPath: { key: StepKey; label: string; hint: string }[] = [
  { key: "requested", label: "Requested", hint: "You sent the repair request." },
  { key: "accepted", label: "Accepted", hint: "The technician accepted the job." },
  { key: "in-progress", label: "In Progress", hint: "The technician is working on it." },
  { key: "completed", label: "Completed", hint: "The work is done and the final amount is set." },
  { key: "paid", label: "Paid", hint: "Payment received through Stripe." },
];

const endings: Partial<Record<StepKey, { label: string; hint: string }>> = {
  rejected: { label: "Rejected", hint: "The technician couldn’t take this job." },
  cancelled: { label: "Cancelled", hint: "You cancelled this request." },
};

type Step = { key: StepKey; label: string; hint: string; at?: string; state: "done" | "current" | "upcoming" | "ended" };

/** The steps to show: the happy path up to now, or Requested → Rejected/Cancelled for a job that stopped. */
function buildSteps(booking: Booking): Step[] {
  const reachedAt = new Map(booking.statusHistory.map((entry) => [entry.status, entry.changedAt]));
  const ending = endings[booking.status];
  if (ending) {
    return [
      { ...happyPath[0]!, at: reachedAt.get("requested"), state: "done" },
      { key: booking.status, ...ending, at: reachedAt.get(booking.status), state: "ended" },
    ];
  }
  const current: StepKey = booking.paymentStatus === "paid" ? "paid" : booking.status;
  const currentIndex = happyPath.findIndex((step) => step.key === current);
  return happyPath.map((step, index) => ({
    ...step,
    at: reachedAt.get(step.key),
    state: index < currentIndex || current === "paid" ? "done" : index === currentIndex ? "current" : "upcoming",
  }));
}

/** Visual step tracker built from the booking's statusHistory (Requested → Accepted → In Progress → Completed → Paid). */
export function JobTimeline({ booking }: { booking: Booking }) {
  const steps = buildSteps(booking);

  return (
    <ol aria-label={`Progress of ${booking.serviceTitle}`} className="relative space-y-1">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const reached = step.state === "done" || step.state === "current" || step.state === "ended";
        return (
          <li key={step.key} aria-current={step.state === "current" ? "step" : undefined} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 rounded-full", step.state === "done" ? "bg-success" : "bg-border")}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                step.state === "done" && "border-success bg-success text-white",
                step.state === "current" && "border-accent bg-accent/10 text-accent",
                step.state === "upcoming" && "border-border bg-card text-muted-foreground",
                step.state === "ended" && (step.key === "rejected" ? "border-error bg-error text-white" : "border-muted-foreground bg-muted-foreground text-white"),
              )}
            >
              {step.state === "done" ? (
                <Check className="size-4" strokeWidth={3} />
              ) : step.state === "ended" ? (
                <X className="size-4" strokeWidth={3} />
              ) : step.state === "current" ? (
                <span className="size-2.5 rounded-full bg-accent" />
              ) : (
                <CircleDashed className="size-4" />
              )}
            </span>
            <div className="min-w-0 pt-1">
              <p className={cn("text-sm font-semibold", reached ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
                <span className="sr-only">
                  {step.state === "done" ? " (done)" : step.state === "current" ? " (current step)" : step.state === "ended" ? " (final)" : " (not yet)"}
                </span>
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                {step.at ? <time dateTime={step.at}>{formatDateTime(step.at)}</time> : step.hint}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
