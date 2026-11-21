"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import type { BookingViewer } from "@/components/dashboard/booking-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { Booking, BookingStatus } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

type NoteForm = { status: BookingStatus; title: string; submitLabel: string; noteLabel: string; required: boolean };
type OpenForm = NoteForm | { status: "review" } | null;

const noteForms: Partial<Record<BookingStatus, NoteForm>> = {
  rejected: { status: "rejected", title: "Decline this request", submitLabel: "Decline request", noteLabel: "Reason for the customer (required)", required: true },
  completed: { status: "completed", title: "Mark the job completed", submitLabel: "Mark completed", noteLabel: "Completion note (optional)", required: false },
  cancelled: { status: "cancelled", title: "Cancel this booking", submitLabel: "Cancel booking", noteLabel: "Reason (optional)", required: false },
};

type BookingActionsProps = {
  booking: Booking;
  viewer: BookingViewer;
  onChanged: () => void;
};

/** The actions the viewer can take for the booking's current status (mirrors server/src/modules/bookings/bookings.workflow.ts). */
export function BookingActions({ booking, viewer, onChanged }: BookingActionsProps) {
  const [openForm, setOpenForm] = useState<OpenForm>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(request: () => Promise<unknown>) {
    setIsBusy(true);
    setError(null);
    try {
      await request();
      setOpenForm(null);
      onChanged();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Something went wrong. Please try again.");
      // A 409 means the booking changed elsewhere; reload so the card shows its real status.
      if (caught instanceof ApiError && caught.status === 409) onChanged();
    } finally {
      setIsBusy(false);
    }
  }

  const changeStatus = (status: BookingStatus, note?: string) =>
    run(() => apiRequest(`/api/bookings/${booking.id}/status`, { method: "PATCH", body: note ? { status, note } : { status } }));

  const buttons: { label: string; onClick: () => void; variant?: "outline" | "default" }[] = [];
  const { status } = booking;
  if (viewer === "technician") {
    if (status === "pending") {
      buttons.push({ label: "Accept request", onClick: () => changeStatus("accepted") });
      buttons.push({ label: "Decline", variant: "outline", onClick: () => setOpenForm(noteForms.rejected ?? null) });
    }
    if (status === "accepted") buttons.push({ label: "Start job", onClick: () => changeStatus("in_progress") });
    if (status === "in_progress") buttons.push({ label: "Mark completed", onClick: () => setOpenForm(noteForms.completed ?? null) });
  }
  if ((viewer === "customer" || viewer === "admin") && (status === "pending" || status === "accepted")) {
    buttons.push({ label: "Cancel booking", variant: "outline", onClick: () => setOpenForm(noteForms.cancelled ?? null) });
  }
  if (viewer === "customer" && status === "completed" && !booking.review) {
    buttons.push({ label: "Leave a review", onClick: () => setOpenForm({ status: "review" }) });
  }

  if (buttons.length === 0 && !error) return null;

  return (
    <div className="mt-5 space-y-3 border-t border-border pt-4">
      {error ? <FormAlert>{error}</FormAlert> : null}
      {openForm === null ? (
        <div className="flex flex-wrap gap-2">
          {buttons.map((button) => (
            <Button key={button.label} type="button" variant={button.variant ?? "default"} disabled={isBusy} onClick={button.onClick} className="h-10 rounded-lg px-4">
              {button.label}
            </Button>
          ))}
        </div>
      ) : openForm.status === "review" ? (
        <ReviewForm
          bookingId={booking.id}
          isBusy={isBusy}
          onCancel={() => setOpenForm(null)}
          onSubmit={(rating, comment) => run(() => apiRequest(`/api/bookings/${booking.id}/review`, { method: "POST", body: { rating, comment } }))}
        />
      ) : (
        <NoteFormView form={openForm} bookingId={booking.id} isBusy={isBusy} onCancel={() => setOpenForm(null)} onSubmit={(note) => changeStatus(openForm.status, note)} />
      )}
    </div>
  );
}

type NoteFormViewProps = { form: NoteForm; bookingId: string; isBusy: boolean; onCancel: () => void; onSubmit: (note: string) => void };

function NoteFormView({ form, bookingId, isBusy, onCancel, onSubmit }: NoteFormViewProps) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const id = `booking-${bookingId}-note`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.required && !note.trim()) {
      setError("Please add a reason.");
      document.getElementById(id)?.focus();
      return;
    }
    onSubmit(note.trim());
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={form.title} className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
      <p className="font-heading font-bold text-foreground">{form.title}</p>
      <div>
        <Label htmlFor={id} className="mb-1.5 text-xs font-semibold text-muted-foreground">
          {form.noteLabel}
        </Label>
        <Textarea
          id={id}
          autoFocus
          rows={3}
          maxLength={500}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="bg-background"
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-error">
            {error}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isBusy} className="h-10 rounded-lg px-4">
          {isBusy ? "Saving…" : form.submitLabel}
        </Button>
        <Button type="button" variant="outline" disabled={isBusy} onClick={onCancel} className="h-10 rounded-lg px-4">
          Back
        </Button>
      </div>
    </form>
  );
}

type ReviewFormProps = { bookingId: string; isBusy: boolean; onCancel: () => void; onSubmit: (rating: number, comment: string) => void };

function ReviewForm({ bookingId, isBusy, onCancel, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const commentId = `booking-${bookingId}-review-comment`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }
    onSubmit(rating, comment.trim());
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Leave a review" className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
      <fieldset>
        <legend className="font-heading font-bold text-foreground">How did the repair go?</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
              <input
                type="radio"
                name={`rating-${bookingId}`}
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setError(null);
                }}
                className="sr-only"
              />
              <Star aria-hidden="true" className={cn("size-7", value <= rating ? "fill-warning text-warning" : "text-muted-foreground")} />
              <span className="sr-only">
                {value} {value === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
        {error ? <p className="mt-1.5 text-xs font-medium text-error">{error}</p> : null}
      </fieldset>
      <div>
        <Label htmlFor={commentId} className="mb-1.5 text-xs font-semibold text-muted-foreground">
          Comment (optional)
        </Label>
        <Textarea id={commentId} rows={3} maxLength={1000} value={comment} onChange={(event) => setComment(event.target.value)} className="bg-background" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isBusy} className="h-10 rounded-lg px-4">
          {isBusy ? "Saving…" : "Submit review"}
        </Button>
        <Button type="button" variant="outline" disabled={isBusy} onClick={onCancel} className="h-10 rounded-lg px-4">
          Back
        </Button>
      </div>
    </form>
  );
}
