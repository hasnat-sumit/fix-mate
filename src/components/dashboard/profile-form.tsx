"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-form-parts";
import { DataState, PageHeader } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import type { Profile } from "@/lib/dashboard-types";
import { roleLabels } from "@/lib/navigation";

export function ProfilePage() {
  const { data, error, isLoading, reload } = useApiQuery<Profile>("/api/users/me");
  return (
    <>
      <PageHeader title="Profile" description="How you appear on FixMate. Technicians’ name, area and bio are shown on their service pages." />
      <DataState isLoading={isLoading} error={error} isEmpty={!data} emptyTitle="" emptyDescription="" onRetry={reload}>
        {data ? <ProfileForm profile={data} /> : null}
      </DataState>
    </>
  );
}

type Values = Pick<Profile, "name" | "phone" | "area" | "bio">;
type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.trim().length > 80) errors.name = "Use 80 characters or fewer.";
  if (values.phone.trim() && !/^\+?[0-9\s()-]{7,20}$/.test(values.phone.trim())) errors.phone = "Enter a valid phone number, or leave it empty.";
  if (values.area.trim().length > 80) errors.area = "Use 80 characters or fewer.";
  if (values.bio.trim().length > 500) errors.bio = "Use 500 characters or fewer.";
  return errors;
}

function ProfileForm({ profile }: { profile: Profile }) {
  const { refetch } = authClient.useSession();
  const [values, setValues] = useState<Values>({ name: profile.name, phone: profile.phone, area: profile.area, bio: profile.bio });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);
    const first = (["name", "phone", "area", "bio"] as const).find((field) => nextErrors[field]);
    if (first) {
      document.getElementById(`profile-${first}`)?.focus();
      return;
    }

    setStatus("saving");
    try {
      const saved = await apiRequest<Profile>("/api/users/me", {
        method: "PATCH",
        body: { name: values.name.trim(), phone: values.phone.trim(), area: values.area.trim(), bio: values.bio.trim() },
      });
      setValues({ name: saved.name, phone: saved.phone, area: saved.area, bio: saved.bio });
      setStatus("saved");
      // The navbar reads the name from the session.
      await refetch();
      // A technician's name, area and bio appear on their public service pages.
      if (profile.role === "technician") await refreshServiceCatalogCache();
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const props = (field: keyof Values, hasHint = false) => ({
    id: `profile-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": describedBy(`profile-${field}`, errors[field], hasHint),
  });

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Edit profile" className="mt-6 max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      {formError ? <FormAlert>{formError}</FormAlert> : null}
      {status === "saved" ? (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-foreground">
          <CheckCircle2 aria-hidden="true" className="size-4 text-success" /> Profile saved.
        </p>
      ) : null}
      <dl className="grid grid-cols-1 gap-3 rounded-xl bg-secondary/60 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">Email</dt>
          <dd className="mt-0.5 break-all text-foreground">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">Account type</dt>
          <dd className="mt-0.5 text-foreground">{roleLabels[profile.role]}</dd>
        </div>
      </dl>
      <FormField id="profile-name" label="Full name" error={errors.name}>
        <Input {...props("name")} autoComplete="name" maxLength={80} onChange={(event) => update("name", event.target.value)} className="h-11 bg-background" />
      </FormField>
      <FormField id="profile-phone" label="Phone (optional)" error={errors.phone} hint="Not shown publicly.">
        <Input {...props("phone", true)} type="tel" autoComplete="tel" onChange={(event) => update("phone", event.target.value)} className="h-11 bg-background" />
      </FormField>
      <FormField id="profile-area" label="Service area (optional)" error={errors.area} hint="For example, the city or neighbourhoods you cover.">
        <Input {...props("area", true)} maxLength={80} onChange={(event) => update("area", event.target.value)} className="h-11 bg-background" />
      </FormField>
      <FormField id="profile-bio" label="Bio (optional)" error={errors.bio} hint="Up to 500 characters about your experience.">
        <Textarea {...props("bio", true)} rows={4} maxLength={500} onChange={(event) => update("bio", event.target.value)} className="bg-background" />
      </FormField>
      <Button type="submit" disabled={status === "saving"} aria-busy={status === "saving"} className="h-11 rounded-lg px-5">
        {status === "saving" ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
