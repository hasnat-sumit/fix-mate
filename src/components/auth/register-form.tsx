"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound, Wrench, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { FormAlert, RedirectingNotice, useRedirectSignedIn } from "@/components/auth/auth-form-parts";
import { PasswordInput } from "@/components/auth/password-input";
import { describedBy, FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { describeAuthError, unreachableError, type AuthErrorKind } from "@/lib/auth-errors";
import { authRoutes, dashboardHome, safeRedirectPath, withReturnPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AccountType = "customer" | "technician";
type Values = { name: string; email: string; password: string; confirmPassword: string };
type Errors = Partial<Record<keyof Values, string>>;

const fieldOrder: (keyof Values)[] = ["name", "email", "password", "confirmPassword"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 6;
const maxPasswordLength = 128;
const passwordHint = `At least ${minPasswordLength} characters, with an uppercase and a lowercase letter.`;

const accountTypes: { value: AccountType; title: string; description: string; icon: LucideIcon }[] = [
  { value: "customer", title: "I need a repair", description: "Find technicians and request services.", icon: UserRound },
  { value: "technician", title: "I’m a technician", description: "List your repair services and take jobs.", icon: Wrench },
];

// Mirrors the server rules (fixmate-server: src/lib/auth.ts); the server remains the source of truth.
function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 80) errors.name = "Use 80 characters or fewer.";

  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";

  if (values.password.length < minPasswordLength) errors.password = `Password must be at least ${minPasswordLength} characters.`;
  else if (values.password.length > maxPasswordLength) errors.password = `Use ${maxPasswordLength} characters or fewer.`;
  else if (!/[A-Z]/.test(values.password)) errors.password = "Password must contain at least one uppercase letter.";
  else if (!/[a-z]/.test(values.password)) errors.password = "Password must contain at least one lowercase letter.";

  if (!values.confirmPassword) errors.confirmPassword = "Re-enter your password.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don’t match.";
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeRedirectPath(searchParams.get("next"), null);
  const { data: session } = authClient.useSession();

  const [accountType, setAccountType] = useState<AccountType>(
    searchParams.get("role") === "technician" || searchParams.get("type") === "technician" ? "technician" : "customer",
  );
  const [values, setValues] = useState<Values>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<{ message: string; kind: AuthErrorKind } | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "redirecting">("idle");

  const isRedirectingSignedIn = useRedirectSignedIn(session, nextPath, status !== "idle");
  if (isRedirectingSignedIn) return <RedirectingNotice />;

  function updateField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);
    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      // `role` is input-only on the server (Better Auth's client types mark it read-only). The server's
      // sign-up hook keeps "customer" or "technician" and saves anything else as "customer".
      const body = { name: values.name.trim(), email: values.email.trim(), password: values.password, role: accountType };
      const { error } = await authClient.signUp.email(body as Parameters<typeof authClient.signUp.email>[0]);
      if (error) {
        const described = describeAuthError(error);
        setFormError(described);
        toast.error(described.message);
        setStatus("idle");
        return;
      }
      setStatus("redirecting");
      toast.success(`Welcome to FixMate, ${body.name.split(" ")[0]}! Your ${accountType} account is ready.`);
      router.replace(nextPath ?? dashboardHome(accountType));
    } catch {
      setFormError(unreachableError);
      toast.error(unreachableError.message);
      setStatus("idle");
    }
  }

  const isBusy = status !== "idle";

  return (
    <form noValidate onSubmit={handleSubmit} aria-labelledby="auth-title" className="space-y-5">
      {formError ? (
        <FormAlert>
          {formError.message}{" "}
          {formError.kind === "duplicate-email" ? (
            <Link href={nextPath ? withReturnPath(authRoutes.signIn, nextPath) : authRoutes.signIn} className="font-semibold text-accent underline underline-offset-4">
              Sign in instead
            </Link>
          ) : null}
        </FormAlert>
      ) : null}

      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-muted-foreground">Account type</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {accountTypes.map(({ value, title, description, icon: Icon }) => {
            const isSelected = accountType === value;
            return (
              <label
                key={value}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  isSelected ? "border-accent bg-accent/5" : "border-border bg-background hover:border-foreground/25",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={isSelected}
                  onChange={() => setAccountType(value)}
                  className="sr-only"
                />
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", isSelected ? "bg-accent text-accent-foreground" : "bg-secondary text-accent")}>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <FormField id="register-name" label="Full name" error={errors.name}>
        <Input
          id="register-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("register-name", errors.name)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="register-email" label="Email address" error={errors.email}>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("register-email", errors.email)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="register-password" label="Password" error={errors.password} hint={passwordHint}>
        <PasswordInput
          id="register-password"
          name="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={describedBy("register-password", errors.password, true)}
          className="h-11 bg-background"
        />
      </FormField>

      <FormField id="register-confirmPassword" label="Confirm password" error={errors.confirmPassword}>
        <PasswordInput
          id="register-confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={describedBy("register-confirmPassword", errors.confirmPassword)}
          className="h-11 bg-background"
        />
      </FormField>

      <Button type="submit" disabled={isBusy} aria-busy={isBusy} className="h-12 w-full rounded-xl">
        {status === "idle" ? `Create ${accountType} account` : "Creating account…"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={nextPath ? withReturnPath(authRoutes.signIn, nextPath) : authRoutes.signIn}
          className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
