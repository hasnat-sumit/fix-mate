"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FormAlert, RedirectingNotice, useRedirectSignedIn } from "@/components/auth/auth-form-parts";
import { PasswordInput } from "@/components/auth/password-input";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, type UserRole } from "@/lib/auth-client";
import { describeAuthError, unreachableError } from "@/lib/auth-errors";
import { authRoutes, dashboardHome, safeRedirectPath, withReturnPath } from "@/lib/navigation";

type Values = { email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // The page the visitor was trying to open, if any; otherwise they go to their own dashboard.
  const nextPath = safeRedirectPath(searchParams.get("next"), null);
  const { data: session } = authClient.useSession();

  const [values, setValues] = useState<Values>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "redirecting">("idle");

  const isRedirectingSignedIn = useRedirectSignedIn(session, nextPath, status !== "idle");
  if (isRedirectingSignedIn) return <RedirectingNotice />;

  function updateField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function fail(message: string) {
    setFormError(message);
    toast.error(message);
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);
    const firstInvalid = (["email", "password"] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`sign-in-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const { data, error } = await authClient.signIn.email({ email: values.email.trim(), password: values.password });
      if (error) return fail(describeAuthError(error).message);

      setStatus("redirecting");
      const user = data.user as { name: string; role: UserRole };
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.replace(nextPath ?? dashboardHome(user.role));
    } catch {
      fail(unreachableError.message);
    }
  }

  const isBusy = status !== "idle";

  return (
    <form noValidate onSubmit={handleSubmit} aria-labelledby="auth-title" className="space-y-4">
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <FormField id="sign-in-email" label="Email address" error={errors.email}>
        <Input
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("sign-in-email", errors.email)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="sign-in-password" label="Password" error={errors.password}>
        <PasswordInput
          id="sign-in-password"
          name="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={describedBy("sign-in-password", errors.password)}
          className="h-11 bg-background"
        />
      </FormField>

      <Button type="submit" disabled={isBusy} aria-busy={isBusy} className="h-12 w-full rounded-xl">
        {status === "idle" ? "Sign in" : "Signing in…"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link
          href={nextPath ? withReturnPath(authRoutes.register, nextPath) : authRoutes.register}
          className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
