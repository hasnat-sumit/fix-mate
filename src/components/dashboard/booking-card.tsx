import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Phone, Star } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/dashboard-ui";
import type { Booking } from "@/lib/dashboard-types";
import { formatCalendarDate, formatDateTime, formatPrice, formatStatus } from "@/lib/format";
import { roleLabels } from "@/lib/navigation";

export type BookingViewer = "customer" | "technician" | "admin";

type BookingCardProps = {
  booking: Booking;
  viewer: BookingViewer;
  actions?: ReactNode;
};

export function BookingCard({ booking, viewer, actions }: BookingCardProps) {
  const headingId = `booking-${booking.id}-title`;
  return (
    <article aria-labelledby={headingId} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">{booking.service.category}</p>
          <h2 id={headingId} className="mt-1 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">
            <Link href={`/services/${booking.service.id}`} className="underline-offset-4 hover:underline">
              {booking.service.title}
            </Link>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={booking.status} />
          {booking.status === "completed" ? <StatusBadge status={booking.paymentStatus} /> : null}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-foreground/85">
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <dt className="sr-only">Preferred date</dt>
          <dd>{formatCalendarDate(booking.preferredDate)}</dd>
        </div>
        <div className="flex items-center gap-2 text-foreground/85">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(booking.amount)}</dd>
        </div>
        {viewer !== "customer" ? (
          <div className="flex items-center gap-2 text-foreground/85">
            <dt className="text-muted-foreground">Customer</dt>
            <dd className="font-semibold">{booking.customer.name}</dd>
          </div>
        ) : null}
        {viewer !== "technician" ? (
          <div className="flex items-center gap-2 text-foreground/85">
            <dt className="text-muted-foreground">Technician</dt>
            <dd className="font-semibold">{booking.technician.name}</dd>
          </div>
        ) : null}
        <div className="flex items-start gap-2 text-foreground/85">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <dt className="sr-only">Address</dt>
          <dd>{booking.address}</dd>
        </div>
        <div className="flex items-center gap-2 text-foreground/85">
          <Phone aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <dt className="sr-only">Contact phone</dt>
          <dd>
            <a href={`tel:${booking.contactPhone.replace(/[^\d+]/g, "")}`} className="underline-offset-4 hover:underline">
              {booking.contactPhone}
            </a>
          </dd>
        </div>
      </dl>

      <p className="mt-4 whitespace-pre-line rounded-xl bg-secondary/60 p-3 text-sm leading-6 text-foreground/85">{booking.problemDescription}</p>

      {booking.review ? (
        <div className="mt-4 rounded-xl border border-border p-3 text-sm">
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <Star aria-hidden="true" className="size-4 fill-warning text-warning" />
            {booking.review.rating} out of 5
          </p>
          {booking.review.comment ? <p className="mt-1 leading-6 text-muted-foreground">{booking.review.comment}</p> : null}
        </div>
      ) : null}

      <details className="group mt-4">
        <summary className="cursor-pointer rounded text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          Timeline ({booking.statusHistory.length} {booking.statusHistory.length === 1 ? "update" : "updates"})
        </summary>
        <ol className="mt-3 space-y-3 border-l border-border pl-4">
          {booking.statusHistory.map((entry, index) => (
            <li key={`${entry.at}-${index}`} className="relative text-sm">
              <span aria-hidden="true" className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-card bg-accent" />
              <p className="font-semibold text-foreground">
                {formatStatus(entry.status)} <span className="font-normal text-muted-foreground">by {roleLabels[entry.role].toLowerCase()}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                <time dateTime={entry.at}>{formatDateTime(entry.at)}</time>
              </p>
              {entry.note ? <p className="mt-1 leading-6 text-foreground/85">“{entry.note}”</p> : null}
            </li>
          ))}
        </ol>
      </details>

      {actions}
    </article>
  );
}
