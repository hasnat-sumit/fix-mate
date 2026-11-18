"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Info, LogIn } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { authRoutes, roleLabels, withReturnPath } from "@/lib/navigation";

type FormValues = {
  date: string;
  address: string;
  phone: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type CreatedBooking = {
  id: string;
  preferredDate: string;
  status: string;
  technician: { name: string };
};

const emptyValues: FormValues = { date: "", address: "", phone: "", description: "" };
const minimumDescriptionLength = 20;
const fieldOrder: (keyof FormValues)[] = ["date", "address", "phone", "description"];
/** API field names (see server/src/modules/bookings/bookings.schemas.ts) mapped to this form's fields. */
const apiFieldNames: Record<string, keyof FormValues> = {
  preferredDate: "date",
  address: "address",
  contactPhone: "phone",
  problemDescription: "description",
};

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

  if (!values.date) errors.date = "Choose a preferred date.";
  // ISO date strings compare correctly as plain strings.
  else if (values.date < localDate(new Date())) errors.date = "Choose today or a future date.";
  else if (values.date > oneYearFromToday()) errors.date = "Choose a date within the next year.";

  const address = values.address.trim();
  if (address.length < 5) errors.address = "Enter the address where the repair is needed.";
  else if (address.length > 200) errors.address = "Use 200 characters or fewer.";

  if (!/^\+?[0-9\s()-]{7,20}$/.test(values.phone.trim())) errors.phone = "Enter a valid phone number.";

  const descriptionLength = values.description.trim().length;
  if (descriptionLength < minimumDescriptionLength) {
    errors.description = `Describe the problem in at least ${minimumDescriptionLength} characters (${descriptionLength}/${minimumDescriptionLength}).`;
  } else if (descriptionLength > 1000) {
    errors.description = "Use 1,000 characters or fewer.";
  }

  return errors;
}

/** Field errors from a 400 response (z.flattenError shape), mapped onto this form. */
function serverFieldErrors(error: ApiError): FormErrors {
  const fieldErrors = (error.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors ?? {};
  const errors: FormErrors = {};
  for (const [apiField, messages] of Object.entries(fieldErrors)) {
    const field = apiFieldNames[apiField];
    if (field && messages?.[0]) errors[field] = messages[0];
  }
  return errors;
}

type ServiceRequestFormProps = {
  serviceId: string;
  serviceName: string;
};

export function ServiceRequestForm({ serviceId, serviceName }: ServiceRequestFormProps) {
  const { data: session, isPending } = authClient.useSession();
  const returnPath = `/services/${serviceId}`;

  if (isPending) {
    return (
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-11 rounded-lg" />
        <Skeleton className="h-11 rounded-lg" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-secondary/60 p-5">
        <div className="flex items-start gap-3">
          <LogIn aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in with a customer account to request <strong className="text-foreground">{serviceName}</strong>. Your request goes straight to the technician.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Button asChild className="h-11 flex-1 rounded-lg">
            <Link href={withReturnPath(authRoutes.signIn, returnPath)}>Sign in to request</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1 rounded-lg">
            <Link href={withReturnPath(authRoutes.register, returnPath)}>Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (session.user.role !== "customer") {
    return (
      <p className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 p-4 text-sm leading-6 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
        Service requests are made from customer accounts. You’re signed in with a {roleLabels[session.user.role].toLowerCase()} account.
      </p>
    );
  }

  return <CustomerRequestForm serviceId={serviceId} serviceName={serviceName} />;
}

function CustomerRequestForm({ serviceId, serviceName }: ServiceRequestFormProps) {
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
          preferredDate: values.date,
          address: values.address.trim(),
          contactPhone: values.phone.trim(),
          problemDescription: values.description.trim(),
        },
      });
      setBooking(created);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const fieldErrors = serverFieldErrors(error);
        setErrors(fieldErrors);
        if (!focusFirstError(fieldErrors)) setFormError(error.message);
      } else {
        setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
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
              <span className="tabular-nums">{booking.preferredDate}</span> is with {booking.technician.name}. It stays{" "}
              <strong className="text-foreground">pending</strong> until they accept or decline it.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">You’ll pay only after the job is completed.</p>
          </div>
        </div>
        <Button asChild variant="outline" className="mt-4 h-11 w-full rounded-lg">
          <Link href="/services">Browse more services</Link>
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={`Request ${serviceName}`} className="space-y-4">
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <FormField id="request-date" label="Preferred date" error={errors.date}>
        <Input
          id="request-date"
          name="date"
          type="date"
          value={values.date}
          // Set the picker range on interaction so rendering stays deterministic.
          onFocus={(event) => {
            event.currentTarget.min = localDate(new Date());
            event.currentTarget.max = oneYearFromToday();
          }}
          onChange={(event) => updateField("date", event.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={describedBy("request-date", errors.date)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="request-address" label="Service address" error={errors.address}>
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

      <FormField id="request-phone" label="Contact phone" error={errors.phone} hint="Shared only with the technician on this job.">
        <Input
          id="request-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("request-phone", errors.phone, true)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField
        id="request-description"
        label="Describe the problem"
        error={errors.description}
        hint={`Minimum ${minimumDescriptionLength} characters.`}
      >
        <Textarea
          id="request-description"
          name="description"
          rows={4}
          maxLength={1000}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="For example: the screen is cracked in the corner and touch stops working."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={describedBy("request-description", errors.description, true)}
          className="min-h-28 bg-background"
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-12 w-full rounded-xl">
        {isSubmitting ? "Sending request…" : "Send request"}
      </Button>
      <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        No payment now. The technician confirms the final quote before starting, and you pay once the job is done.
      </p>
    </form>
  );
}
