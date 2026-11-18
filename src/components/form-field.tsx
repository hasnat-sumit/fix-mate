import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

/**
 * Label, control and one message line. The control should set
 * `aria-describedby` to `${id}-error` when there is an error, otherwise `${id}-hint`.
 */
export function FormField({ id, label, error, hint, children }: FormFieldProps) {
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

/** The `aria-describedby` value matching what FormField renders. */
export function describedBy(id: string, error: string | undefined, hasHint = false) {
  if (error) return `${id}-error`;
  return hasHint ? `${id}-hint` : undefined;
}
