"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  name: string;
  email: string;
  date: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyValues: FormValues = { name: "", email: "", date: "", description: "" };
const minimumDescriptionLength = 20;
const fieldOrder: (keyof FormValues)[] = ["name", "email", "date", "description"];

/** Today's date as YYYY-MM-DD in the visitor's local time zone. */
function localToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) errors.name = "Enter your full name.";

  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";

  if (!values.date) errors.date = "Choose a preferred date.";
  // ISO date strings compare correctly as plain strings.
  else if (values.date < localToday()) errors.date = "Choose today or a future date.";

  const descriptionLength = values.description.trim().length;
  if (descriptionLength < minimumDescriptionLength) {
    errors.description = `Describe the problem in at least ${minimumDescriptionLength} characters (${descriptionLength}/${minimumDescriptionLength}).`;
  }

  return errors;
}

type ServiceRequestFormProps = {
  serviceName: string;
};

export function ServiceRequestForm({ serviceName }: ServiceRequestFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    // Re-validate live only after the first submit attempt, to avoid scolding while typing.
    if (hasAttemptedSubmit) setErrors(validate(nextValues));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setHasAttemptedSubmit(true);

    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalidField) {
      document.getElementById(`request-${firstInvalidField}`)?.focus();
      return;
    }

    setIsSubmitted(true);
  }

  function resetForm() {
    setValues(emptyValues);
    setErrors({});
    setHasAttemptedSubmit(false);
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div role="status" className="rounded-xl border border-success/30 bg-success/10 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-heading font-bold text-foreground">Demo request ready</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your request for <strong className="text-foreground">{serviceName}</strong> on{" "}
              <span className="tabular-nums">{values.date}</span> passed validation. This is a frontend preview, so nothing was sent and no booking was created.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={resetForm} className="mt-4 h-11 w-full rounded-lg">
          Start a new request
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={`Request ${serviceName}`} className="space-y-4">
      <FormField id="request-name" label="Full name" error={errors.name}>
        <Input
          id="request-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "request-name-error" : undefined}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="request-email" label="Email address" error={errors.email}>
        <Input
          id="request-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "request-email-error" : undefined}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="request-date" label="Preferred date" error={errors.date}>
        <Input
          id="request-date"
          name="date"
          type="date"
          value={values.date}
          // Set the picker minimum on interaction so rendering stays deterministic.
          onFocus={(event) => {
            event.currentTarget.min = localToday();
          }}
          onChange={(event) => updateField("date", event.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "request-date-error" : undefined}
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
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="For example: the screen is cracked in the corner and touch stops working."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "request-description-error" : "request-description-hint"}
          className="min-h-28 bg-background"
        />
      </FormField>

      <Button type="submit" className="h-12 w-full rounded-xl">
        Send demo request
      </Button>
      <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        Frontend demonstration only. Requests are validated in your browser and are not sent anywhere.
      </p>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function FormField({ id, label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
