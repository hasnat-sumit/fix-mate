"use client";

import { useState, type FormEvent } from "react";
import { House, Info, Store } from "lucide-react";
import { toast } from "sonner";
import { selectClassName } from "@/components/dashboard/dashboard-ui";
import { describedBy, FormField } from "@/components/form-field";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategoryNames, serviceModes, type ServiceMode } from "@/data/service-categories";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import type { Service } from "@/lib/services-api";
import { cn } from "@/lib/utils";

type Values = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: ServiceMode | "";
  serviceArea: string;
  image: string | null;
};
type Errors = Partial<Record<keyof Values, string>>;

const fieldOrder: (keyof Values)[] = ["title", "category", "description", "basePrice", "estimatedDuration", "serviceMode", "serviceArea", "image"];
const modeIcons: Record<ServiceMode, typeof House> = { "Home Visit": House, "Shop Drop-off": Store };

const toValues = (service?: Service): Values => ({
  title: service?.title ?? "",
  category: service?.category ?? "",
  description: service?.description ?? "",
  basePrice: service ? String(service.basePrice) : "",
  estimatedDuration: service?.estimatedDuration ?? "",
  serviceMode: service?.serviceMode ?? "",
  serviceArea: service?.serviceArea ?? "",
  image: service?.image ?? null,
});

/** "49.5" -> 49.5; NaN unless it's a positive amount with at most two decimals. */
const toAmount = (value: string) => (/^\d+(\.\d{1,2})?$/.test(value.trim()) ? Number(value) : Number.NaN);

// Mirrors the server rules (fixmate-server: services.schemas.ts); the server remains the source of truth.
function validate(values: Values): Errors {
  const errors: Errors = {};
  const title = values.title.trim();
  if (title.length < 3 || title.length > 100) errors.title = "Use 3 to 100 characters.";
  if (!values.category) errors.category = "Choose a category.";
  const description = values.description.trim();
  if (description.length < 20) errors.description = `Describe what the service includes (at least 20 characters, ${description.length}/20).`;
  else if (description.length > 2000) errors.description = "Use 2,000 characters or fewer.";
  const price = toAmount(values.basePrice);
  if (Number.isNaN(price) || price <= 0) errors.basePrice = "Enter a positive price in USD, like 45 or 45.50.";
  else if (price > 10_000) errors.basePrice = "Use a price up to $10,000.";
  if (!values.estimatedDuration.trim()) errors.estimatedDuration = "Enter an estimated duration, e.g. “2-3 hours”.";
  if (!values.serviceMode) errors.serviceMode = "Choose Home Visit or Shop Drop-off.";
  if (values.serviceArea.trim().length < 2) errors.serviceArea = "Enter the area you cover, e.g. “Dhanmondi, Dhaka”.";
  if (!values.image) errors.image = "Upload a service image.";
  return errors;
}

type ServiceFormProps = {
  /** Edit mode when given; otherwise creates a new service. */
  service?: Service;
  onSaved: (service: Service) => void;
  onCancel?: () => void;
  /** Lets a surrounding modal block closing while saving or uploading. */
  onBusyChange?: (isBusy: boolean) => void;
};

/**
 * Add or edit a service. Technician name and email come from the session (read-only); the server sets them too.
 * New services start as "pending"; editing sends the service back to "pending" for admin approval.
 */
export function ServiceForm({ service, onSaved, onCancel, onBusyChange }: ServiceFormProps) {
  const { data: session } = authClient.useSession();
  const [values, setValues] = useState<Values>(() => toValues(service));
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = Boolean(service);
  const formId = isEditing ? `service-edit-${service?._id}` : "service-new";

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function setBusy(saving: boolean, uploading: boolean) {
    setIsSaving(saving);
    setIsUploading(uploading);
    onBusyChange?.(saving || uploading);
  }

  function focusFirst(nextErrors: Errors) {
    const first = fieldOrder.find((field) => nextErrors[field]);
    if (first) document.getElementById(`${formId}-${first}`)?.focus();
    return Boolean(first);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (focusFirst(nextErrors)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const body = {
      title: values.title.trim(),
      category: values.category,
      description: values.description.trim(),
      basePrice: toAmount(values.basePrice),
      estimatedDuration: values.estimatedDuration.trim(),
      serviceMode: values.serviceMode,
      serviceArea: values.serviceArea.trim(),
      // Seeded services use bundled /images/ paths; only send the image when it's a new upload.
      ...(values.image && (values.image !== service?.image || values.image.startsWith("https://")) ? { image: values.image } : {}),
    };

    setBusy(true, false);
    try {
      const saved = await apiRequest<Service>(isEditing ? `/api/services/${service?._id}` : "/api/services", {
        method: isEditing ? "PATCH" : "POST",
        body,
      });
      // An edit can take a service off the public pages until it's approved again.
      if (isEditing) await refreshServiceCatalogCache();
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const fieldErrors = (error.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors ?? {};
        const mapped: Errors = {};
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (field in values && messages?.[0]) mapped[field as keyof Values] = messages[0];
        }
        setErrors(mapped);
        focusFirst(mapped);
      }
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false, false);
    }
  }

  const id = (field: keyof Values) => `${formId}-${field}`;
  const inputProps = (field: Exclude<keyof Values, "image" | "serviceMode">, hasHint = false) => ({
    id: id(field),
    name: field,
    value: values[field],
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": describedBy(id(field), errors[field], hasHint),
  });

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={isEditing ? `Edit ${service?.title}` : "Add a service"} className="space-y-5">
      <p className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-sm leading-6 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
        {isEditing
          ? "Saving changes sends the service back to Pending. It stays off the public pages until an admin approves it again."
          : "New services are Pending until an admin approves them. Only approved, available services appear on the public pages."}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id={id("title")} label="Title" error={errors.title}>
          <Input {...inputProps("title")} maxLength={100} placeholder="e.g. iPhone Screen Replacement" onChange={(event) => update("title", event.target.value)} className="h-11 bg-background" />
        </FormField>
        <FormField id={id("category")} label="Category" error={errors.category}>
          <select {...inputProps("category")} onChange={(event) => update("category", event.target.value)} className={cn(selectClassName, "h-11 w-full")}>
            <option value="">Choose a category</option>
            {serviceCategoryNames.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id={id("description")} label="Description" error={errors.description} hint="What the service includes. At least 20 characters.">
        <Textarea {...inputProps("description", true)} rows={4} maxLength={2000} onChange={(event) => update("description", event.target.value)} className="bg-background" />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id={id("basePrice")} label="Base price (USD)" error={errors.basePrice} hint="The starting price shown on cards.">
          <Input {...inputProps("basePrice", true)} inputMode="decimal" placeholder="45" onChange={(event) => update("basePrice", event.target.value)} className="h-11 bg-background" />
        </FormField>
        <FormField id={id("estimatedDuration")} label="Estimated duration" error={errors.estimatedDuration} hint="e.g. “2-3 hours” or “1 day”.">
          <Input {...inputProps("estimatedDuration", true)} maxLength={50} onChange={(event) => update("estimatedDuration", event.target.value)} className="h-11 bg-background" />
        </FormField>
      </div>

      <fieldset aria-describedby={errors.serviceMode ? `${id("serviceMode")}-error` : undefined}>
        <legend className="mb-1.5 text-xs font-semibold text-muted-foreground">Service mode</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {serviceModes.map((mode, index) => {
            const Icon = modeIcons[mode];
            const isSelected = values.serviceMode === mode;
            return (
              <label
                key={mode}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  isSelected ? "border-accent bg-accent/5 text-foreground" : "border-border bg-background text-foreground/80 hover:border-foreground/25",
                  errors.serviceMode && !values.serviceMode && "border-error",
                )}
              >
                <input
                  type="radio"
                  id={index === 0 ? id("serviceMode") : undefined}
                  name={`${formId}-serviceMode`}
                  value={mode}
                  checked={isSelected}
                  onChange={() => update("serviceMode", mode)}
                  className="sr-only"
                />
                <Icon aria-hidden="true" className={cn("size-5", isSelected ? "text-accent" : "text-muted-foreground")} />
                {mode}
              </label>
            );
          })}
        </div>
        {errors.serviceMode ? (
          <p id={`${id("serviceMode")}-error`} className="mt-1.5 text-xs font-medium text-error">
            {errors.serviceMode}
          </p>
        ) : null}
      </fieldset>

      <FormField id={id("serviceArea")} label="Service area" error={errors.serviceArea} hint="The area you cover, e.g. “Dhanmondi, Dhaka”.">
        <Input {...inputProps("serviceArea", true)} maxLength={100} onChange={(event) => update("serviceArea", event.target.value)} className="h-11 bg-background" />
      </FormField>

      <ImageUpload
        id={id("image")}
        label="Service image"
        value={values.image}
        onChange={(url) => update("image", url)}
        onUploadingChange={(uploading) => setBusy(isSaving, uploading)}
        error={errors.image}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id={`${formId}-technicianName`} label="Technician name">
          <Input id={`${formId}-technicianName`} value={session?.user.name ?? ""} readOnly className="h-11 bg-secondary/60 text-muted-foreground" />
        </FormField>
        <FormField id={`${formId}-technicianEmail`} label="Technician email">
          <Input id={`${formId}-technicianEmail`} value={session?.user.email ?? ""} readOnly className="h-11 bg-secondary/60 text-muted-foreground" />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={isSaving || isUploading} aria-busy={isSaving} className="h-11 rounded-lg px-6">
          {isSaving ? "Saving…" : isUploading ? "Waiting for upload…" : isEditing ? "Save changes" : "Submit for approval"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel} className="h-11 rounded-lg px-5">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
