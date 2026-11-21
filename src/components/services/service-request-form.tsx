"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info, Wrench } from "lucide-react";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { formatCalendarDate } from "@/lib/format";
import { authRoutes, myBookingsHref, withReturnPath } from "@/lib/navigation";

type FormValues = {
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type CreatedBooking = { _id: string; preferredDate: string; technicianName: string };

const emptyValues: FormValues = { customerPhone: "", address: "", preferredDate: "", problemDescription: "" };
const minimumDescriptionLength = 20;
const fieldOrder: (keyof FormValues)[] = ["customerPhone", "address", "preferredDate", "problemDescription"];

/** A date as YYYY-MM-DD in the visitor's local time zone. */
function localDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function oneYearFromToday() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return localDate(date);
}

// Mirrors the server's rules; the server remains the source of truth.
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!/^\+?[0-9\s()-]{7,20}$/.test(values.customerPhone.trim())) errors.customerPhone = "Enter a valid phone number.";

  const address = values.address.trim();
  if (address.length < 5) errors.address = "Enter the address where the repair is needed.";
  else if (address.length > 200) errors.address = "Use 200 characters or fewer.";

  if (!values.preferredDate) errors.preferredDate = "Choose a preferred date.";
  // ISO date strings compare correctly as plain strings.
  else if (values.preferredDate < localDate(new Date())) errors.preferredDate = "Choose today or a future date.";
  else if (values.preferredDate > oneYearFromToday()) errors.preferredDate = "Choose a date within the next year.";

  const descriptionLength = values.problemDescription.trim().length;
  if (descriptionLength < minimumDescriptionLength) {
    errors.problemDescription = `Describe the problem in at least ${minimumDescriptionLength} characters (${descriptionLength}/${minimumDescriptionLength}).`;
  } else if (descriptionLength > 1000) {
    errors.problemDescription = "Use 1,000 characters or fewer.";
  }

  return errors;
}

/** Field errors from a 400 response (z.flattenError shape). The form uses the API's field names. */
function serverFieldErrors(error: ApiError): FormErrors {
  const fieldErrors = (error.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors ?? {};
  const errors: FormErrors = {};
  for (const field of fieldOrder) {
    const message = fieldErrors[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
}

type ServiceRequestFormProps = {
  serviceId: string;
  serviceName: string;
  technicianEmail: string;
};

/**
 * The Request Repair flow. Logged out: the button goes to sign-in and back. Technicians and admins:
 * the button is disabled with a notice. Customers: the button opens the request form.
 */
export function ServiceRequestForm({ serviceId, serviceName, technicianEmail }: ServiceRequestFormProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (isPending) return <Skeleton aria-hidden="true" className="h-12 rounded-xl" />;

  if (!session) {
    return (
      <div className="space-y-3">
        <Button type="button" onClick={() => router.push(withReturnPath(authRoutes.signIn, `/services/${serviceId}`))} className="h-12 w-full rounded-xl">
          <Wrench aria-hidden="true" className="size-4" /> Request Repair
        </Button>
        <p className="text-center text-xs text-muted-foreground">You’ll be asked to sign in first, then brought back here.</p>
      </div>
    );
  }

  if (session.user.role !== "customer") {
    const isOwnService = session.user.email.toLowerCase() === technicianEmail.toLowerCase();
    return (
      <div className="space-y-3">
        <Button type="button" disabled className="h-12 w-full rounded-xl">
          <Wrench aria-hidden="true" className="size-4" /> Request Repair
        </Button>
        <p role="note" className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 p-4 text-sm leading-6 text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          {isOwnService ? "This is your own service. " : ""}Only customers can request a repair.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button type="button" onClick={() => setIsOpen(true)} className="h-12 w-full rounded-xl">
        <Wrench aria-hidden="true" className="size-4" /> Request Repair
      </Button>
    );
  }

  return (
    <CustomerRequestForm
      serviceId={serviceId}
      serviceName={serviceName}
      customer={{ name: session.user.name, email: session.user.email }}
      onCancel={() => setIsOpen(false)}
    />
  );
}

type CustomerRequestFormProps = {
  serviceId: string;
  serviceName: string;
  customer: { name: string; email: string };
  onCancel: () => void;
};

function CustomerRequestForm({ serviceId, serviceName, customer, onCancel }: CustomerRequestFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<CreatedBooking | null>(null);

  function updateField(field: keyof FormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    // Re-validate live only after the first submit attempt, to avoid scolding while typing.
    if (hasAttemptedSubmit) setErrors(validate(nextValues));
  }

  function focusFirstError(nextErrors: FormErrors) {
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalidField) document.getElementById(`request-${firstInvalidField}`)?.focus();
    return Boolean(firstInvalidField);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setHasAttemptedSubmit(true);
    setFormError(null);
    if (focusFirstError(nextErrors)) return;

    setIsSubmitting(true);
    try {
      const created = await apiRequest<CreatedBooking>("/api/bookings", {
        method: "POST",
        body: {
          serviceId,
          customerPhone: values.customerPhone.trim(),
          address: values.address.trim(),
          preferredDate: values.preferredDate,
          problemDescription: values.problemDescription.trim(),
        },
      });
      setBooking(created);
      toast.success("Repair request sent!", {
        description: `${created.technicianName} will review it soon.`,
        action: { label: "My Bookings", onClick: () => window.location.assign(myBookingsHref) },
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const fieldErrors = serverFieldErrors(error);
        setErrors(fieldErrors);
        if (!focusFirstError(fieldErrors)) setFormError(error.message);
        toast.error("Please check the highlighted fields.");
      } else {
        // e.g. 409 "You already have an active request for this service".
        const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
        setFormError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (booking) {
    return (
      <div role="status" className="rounded-xl border border-success/30 bg-success/10 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-heading font-bold text-foreground">Request sent</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your request for <strong className="text-foreground">{serviceName}</strong> on{" "}
              <span className="tabular-nums">{formatCalendarDate(booking.preferredDate.slice(0, 10))}</span> is with {booking.technicianName}. Its
              status is <strong className="text-foreground">Requested</strong> until they accept it.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">You’ll pay only after the job is completed.</p>
          </div>
        </div>
        <Button asChild className="mt-4 h-11 w-full rounded-lg">
          <Link href={myBookingsHref}>Go to My Bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={`Request ${serviceName}`} className="space-y-4">
      <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">Request a repair</h2>
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <FormField id="request-name" label="Name">
          <Input id="request-name" value={customer.name} readOnly className="h-11 bg-secondary/60 text-muted-foreground" />
        </FormField>
        <FormField id="request-email" label="Email">
          <Input id="request-email" type="email" value={customer.email} readOnly className="h-11 bg-secondary/60 text-muted-foreground" />
        </FormField>
      </div>

      <FormField id="request-customerPhone" label="Phone" error={errors.customerPhone} hint="Shared only with the technician on this job.">
        <Input
          id="request-customerPhone"
          name="customerPhone"
          type="tel"
          autoComplete="tel"
          value={values.customerPhone}
          onChange={(event) => updateField("customerPhone", event.target.value)}
          aria-invalid={Boolean(errors.customerPhone)}
          aria-describedby={describedBy("request-customerPhone", errors.customerPhone, true)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="request-address" label="Address" error={errors.address}>
        <Input
          id="request-address"
          name="address"
          autoComplete="street-address"
          value={values.address}
          onChange={(event) => updateField("address", event.target.value)}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={describedBy("request-address", errors.address)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="request-preferredDate" label="Preferred date" error={errors.preferredDate}>
        <Input
          id="request-preferredDate"
          name="preferredDate"
          type="date"
          value={values.preferredDate}
          // Set the picker range on interaction so rendering stays deterministic.
          onFocus={(event) => {
            event.currentTarget.min = localDate(new Date());
            event.currentTarget.max = oneYearFromToday();
          }}
          onChange={(event) => updateField("preferredDate", event.target.value)}
          aria-invalid={Boolean(errors.preferredDate)}
          aria-describedby={describedBy("request-preferredDate", errors.preferredDate)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField
        id="request-problemDescription"
        label="Problem description"
        error={errors.problemDescription}
        hint={`Minimum ${minimumDescriptionLength} characters.`}
      >
        <Textarea
          id="request-problemDescription"
          name="problemDescription"
          rows={4}
          maxLength={1000}
          value={values.problemDescription}
          onChange={(event) => updateField("problemDescription", event.target.value)}
          placeholder="For example: the screen is cracked in the corner and touch stops working."
          aria-invalid={Boolean(errors.problemDescription)}
          aria-describedby={describedBy("request-problemDescription", errors.problemDescription, true)}
          className="min-h-28 bg-background"
        />
      </FormField>

      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-12 flex-1 rounded-xl">
          {isSubmitting ? "Sending request…" : "Send Request"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="h-12 rounded-xl sm:px-6">
          Cancel
        </Button>
      </div>
      <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        No payment now. You pay once the technician marks the job completed.
      </p>
    </form>
  );
}
