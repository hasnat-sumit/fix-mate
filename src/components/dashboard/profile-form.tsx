"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RoleBadge } from "@/components/auth/user-identity";
import { DataState, PageHeader } from "@/components/dashboard/dashboard-ui";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { describedBy, FormField } from "@/components/form-field";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiRequest, refreshServiceCatalogCache } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import type { Profile } from "@/lib/dashboard-types";
import { formatDate } from "@/lib/format";

/** Update Profile (all roles): name, phone, area, bio and photo. Email and role are read-only. */
export function ProfilePage() {
  const { data, error, isLoading, reload } = useApiQuery<Profile>("/api/users/profile");
  return (
    <>
      <PageHeader title="Update Profile" description="How you appear on FixMate. A technician’s name, photo, area and bio are shown on their service pages." />
      <DataState isLoading={isLoading} error={error} isEmpty={!data} emptyTitle="Profile unavailable" emptyDescription="Please try again." onRetry={reload}>
        {data ? <ProfileForm profile={data} /> : null}
      </DataState>
    </>
  );
}

type Values = { name: string; phone: string; area: string; bio: string; image: string | null };
type Errors = Partial<Record<keyof Values, string>>;
const textFields = ["name", "phone", "area", "bio"] as const;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.trim().length > 80) errors.name = "Use 80 characters or fewer.";
  if (values.phone.trim() && !/^\+?[0-9\s()-]{7,20}$/.test(values.phone.trim())) errors.phone = "Enter a valid phone number, or leave it empty.";
  if (values.area.trim().length > 80) errors.area = "Use 80 characters or fewer.";
  if (values.bio.trim().length > 500) errors.bio = "Use 500 characters or fewer.";
  return errors;
}

const toValues = (profile: Profile): Values => ({
  name: profile.name,
  phone: profile.phone,
  area: profile.area,
  bio: profile.bio,
  image: profile.image,
});

function ProfileForm({ profile }: { profile: Profile }) {
  const { refetch } = authClient.useSession();
  const [values, setValues] = useState<Values>(() => toValues(profile));
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const first = textFields.find((field) => nextErrors[field]);
    if (first) {
      document.getElementById(`profile-${first}`)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const saved = await apiRequest<Profile>("/api/users/profile", {
        method: "PATCH",
        // Empty strings clear optional fields on the server.
        body: { name: values.name.trim(), phone: values.phone.trim(), area: values.area.trim(), bio: values.bio.trim(), image: values.image ?? "" },
      });
      setValues(toValues(saved));
      // The navbar and dashboard top bar read the name and photo from the session: refresh it, no sign-out needed.
      await refetch();
      toast.success("Profile updated.");
      // A technician's name, photo, area and bio appear on their public service pages.
      if (profile.role === "technician") await refreshServiceCatalogCache();
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const fieldErrors = (error.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors ?? {};
        setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0]])) as Errors);
      }
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const props = (field: (typeof textFields)[number], hasHint = false) => ({
    id: `profile-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": describedBy(`profile-${field}`, errors[field], hasHint),
  });

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Update profile" className="mt-6 max-w-3xl space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <ImageUpload
        id="profile-image"
        label="Profile photo"
        shape="avatar"
        value={values.image}
        onChange={(url) => update("image", url)}
        onUploadingChange={setIsUploading}
        error={errors.image}
        allowRemove
      />

      <dl className="grid grid-cols-1 gap-3 rounded-xl bg-secondary/60 p-4 text-sm sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-xs font-semibold text-muted-foreground">Email (read-only)</dt>
          <dd className="mt-1 break-all text-foreground">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">Role (read-only)</dt>
          <dd className="mt-1">
            <RoleBadge role={profile.role} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">Member since</dt>
          <dd className="mt-1 text-foreground">{formatDate(profile.createdAt)}</dd>
        </div>
      </dl>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="profile-name" label="Full name" error={errors.name}>
          <Input {...props("name")} autoComplete="name" maxLength={80} onChange={(event) => update("name", event.target.value)} className="h-11 bg-background" />
        </FormField>
        <FormField id="profile-phone" label="Phone" error={errors.phone} hint="Shared only with people you have jobs with.">
          <Input {...props("phone", true)} type="tel" autoComplete="tel" onChange={(event) => update("phone", event.target.value)} className="h-11 bg-background" />
        </FormField>
      </div>
      <FormField id="profile-area" label="Area" error={errors.area} hint="City / area, e.g. “Mirpur, Dhaka”.">
        <Input {...props("area", true)} maxLength={80} onChange={(event) => update("area", event.target.value)} className="h-11 bg-background" />
      </FormField>
      <FormField id="profile-bio" label="Bio" error={errors.bio} hint={profile.role === "technician" ? "Your skills and experience, up to 500 characters." : "A few words about you, up to 500 characters."}>
        <Textarea {...props("bio", true)} rows={4} maxLength={500} onChange={(event) => update("bio", event.target.value)} className="bg-background" />
      </FormField>

      <Button type="submit" disabled={isSaving || isUploading} aria-busy={isSaving} className="h-11 rounded-lg px-6">
        {isSaving ? "Saving…" : isUploading ? "Waiting for upload…" : "Save changes"}
      </Button>
    </form>
  );
}
