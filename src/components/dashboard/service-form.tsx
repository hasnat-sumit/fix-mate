"use client";

import { useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { selectClassName } from "@/components/dashboard/dashboard-ui";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategories } from "@/data/service-categories";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { OwnerService } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

type Values = {
  title: string;
  category: string;
  description: string;
  details: string;
  price: string;
  image: string;
  includes: string;
  availability: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const fieldOrder: (keyof Values)[] = ["title", "category", "description", "price", "image", "details", "includes", "availability"];

function toValues(service?: OwnerService): Values {
  return {
    title: service?.title ?? "",
    category: service?.category ?? "",
    description: service?.description ?? "",
    details: service?.details ?? "",
    price: service ? (service.price / 100).toFixed(2).replace(/\.00$/, "") : "",
    image: service?.image ?? "",
    includes: service?.includes.join("\n") ?? "",
    availability: service?.availability ?? "",
  };
}

const includesList = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
/** "49.5" -> 4950 cents; NaN when the text isn't a price with at most two decimals. */
const toCents = (value: string) => (/^\d+(\.\d{1,2})?$/.test(value.trim()) ? Math.round(Number(value) * 100) : Number.NaN);

// Mirrors the server rules; the server remains the source of truth.
function validate(values: Values): Errors {
  const errors: Errors = {};
  const title = values.title.trim();
  if (title.length < 3 || title.length > 100) errors.title = "Use 3 to 100 characters.";
  if (!values.category) errors.category = "Choose a category.";
  const description = values.description.trim();
  if (description.length < 10 || description.length > 200) errors.description = "Use 10 to 200 characters.";
  if (values.details.trim().length > 2000) errors.details = "Use 2,000 characters or fewer.";
  const cents = toCents(values.price);
  if (Number.isNaN(cents)) errors.price = "Enter a price in dollars, like 49 or 49.50.";
  else if (cents < 100 || cents > 1_000_000) errors.price = "Use a price between $1 and $10,000.";
  if (!/^https:\/\/\S+$/.test(values.image.trim())) errors.image = "Enter an image link starting with https://.";
  const includes = includesList(values.includes);
  if (includes.length > 10) errors.includes = "List at most 10 items.";
  else if (includes.some((item) => item.length > 100)) errors.includes = "Keep each item to 100 characters or fewer.";
  if (values.availability.trim().length > 120) errors.availability = "Use 120 characters or fewer.";
  return errors;
}

type ServiceFormProps = {
  service?: OwnerService;
  onSaved: () => void;
  onCancel: () => void;
};

/** Create or edit a service. Seeded services keep their bundled /images/ path unless the technician replaces it. */
export function ServiceForm({ service, onSaved, onCancel }: ServiceFormProps) {
  const [values, setValues] = useState<Values>(() => toValues(service));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(service);
  const keepsSeededImage = Boolean(service && values.image === service.image && !values.image.startsWith("https://"));

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirst(nextErrors: Errors) {
    const first = fieldOrder.find((field) => nextErrors[field]);
    if (first) document.getElementById(`service-${first}`)?.focus();
    return Boolean(first);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (keepsSeededImage) delete nextErrors.image;
    setErrors(nextErrors);
    setFormError(null);
    if (focusFirst(nextErrors)) return;

    const body = {
      title: values.title.trim(),
      category: values.category,
      description: values.description.trim(),
      details: values.details.trim(),
      price: toCents(values.price),
      includes: includesList(values.includes),
      availability: values.availability.trim(),
      ...(keepsSeededImage ? {} : { image: values.image.trim() }),
    };

    setIsSaving(true);
    try {
      await apiRequest(isEditing ? `/api/services/${service?.id}` : "/api/services", { method: isEditing ? "PATCH" : "POST", body });
      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const fieldErrors = (error.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors ?? {};
        const mapped: Errors = {};
        // The form uses the API's field names (see server/src/modules/services/services.schemas.ts).
        for (const [apiField, messages] of Object.entries(fieldErrors)) {
          if (apiField in values && messages?.[0]) mapped[apiField as keyof Values] = messages[0];
        }
        setErrors(mapped);
        if (!focusFirst(mapped)) setFormError(error.message);
      } else {
        setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const field = (name: keyof Values, label: string, hint?: string, className?: string) => ({
    id: `service-${name}`,
    label,
    error: errors[name],
    hint,
    className,
  });
  const inputProps = (name: keyof Values, hasHint = false) => ({
    id: `service-${name}`,
    name,
    value: values[name],
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": describedBy(`service-${name}`, errors[name], hasHint),
  });

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={isEditing ? `Edit ${service?.title}` : "Add a service"} className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="font-heading text-xl font-bold tracking-[-0.03em] text-foreground">{isEditing ? "Edit service" : "Add a service"}</h2>
      <p className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-sm leading-6 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
        {isEditing
          ? "Changing any details sends the service back for admin approval. It stays off the public site until it’s approved again."
          : "New services are reviewed by an admin before they appear on the public site."}
      </p>
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldBox {...field("title", "Service title")}>
          <Input {...inputProps("title")} maxLength={100} onChange={(event) => update("title", event.target.value)} className="h-11 bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("category", "Category")}>
          <select {...inputProps("category")} onChange={(event) => update("category", event.target.value)} className={cn(selectClassName, "h-11 w-full")}>
            <option value="">Choose a category</option>
            {serviceCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </FormFieldBox>
        <FormFieldBox {...field("description", "Short description", "Shown on service cards. 10–200 characters.", "sm:col-span-2")}>
          <Input {...inputProps("description", true)} maxLength={200} onChange={(event) => update("description", event.target.value)} className="h-11 bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("price", "Starting price (USD)", "For example 49 or 49.50.")}>
          <Input {...inputProps("price", true)} inputMode="decimal" onChange={(event) => update("price", event.target.value)} className="h-11 bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("image", "Image link", keepsSeededImage ? "Uses the catalog image. Paste an https link to replace it." : "A public https link to a photo of your work.")}>
          <Input {...inputProps("image", true)} type="url" inputMode="url" onChange={(event) => update("image", event.target.value)} className="h-11 bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("details", "Full details (optional)", undefined, "sm:col-span-2")}>
          <Textarea {...inputProps("details")} rows={4} maxLength={2000} onChange={(event) => update("details", event.target.value)} className="bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("includes", "What’s included (optional)", "One item per line, up to 10.")}>
          <Textarea {...inputProps("includes", true)} rows={4} onChange={(event) => update("includes", event.target.value)} className="bg-background" />
        </FormFieldBox>
        <FormFieldBox {...field("availability", "Availability (optional)", "For example: weekdays 9am–5pm.")}>
          <Input {...inputProps("availability", true)} maxLength={120} onChange={(event) => update("availability", event.target.value)} className="h-11 bg-background" />
        </FormFieldBox>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving} aria-busy={isSaving} className="h-11 rounded-lg px-5">
          {isSaving ? "Saving…" : isEditing ? "Save and resubmit" : "Submit for approval"}
        </Button>
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel} className="h-11 rounded-lg px-5">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function FormFieldBox({ className, ...props }: Parameters<typeof FormField>[0] & { className?: string }) {
  return (
    <div className={className}>
      <FormField {...props} />
    </div>
  );
}
