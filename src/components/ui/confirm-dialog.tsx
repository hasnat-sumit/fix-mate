"use client";

import type { ReactNode } from "react";
import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Destructive actions (delete, cancel, reject) get the red confirm button. */
  destructive?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  /** Extra content between the description and the buttons, e.g. an amount field. */
  children?: ReactNode;
};

/** Accessible confirmation modal (focus-trapped, Escape closes) used before destructive actions. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Keep it",
  destructive = false,
  isBusy = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !isBusy && onOpenChange(next)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[70] bg-foreground/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <AlertDialog.Title className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">{title}</AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className="mt-2 text-sm leading-6 text-muted-foreground">{description}</div>
          </AlertDialog.Description>
          {children ? <div className="mt-4">{children}</div> : null}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" disabled={isBusy} className="h-11 rounded-lg px-5">
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            {/* Not AlertDialog.Action: the dialog stays open (and shows progress) until the request finishes. */}
            <Button
              type="button"
              disabled={isBusy}
              aria-busy={isBusy}
              onClick={onConfirm}
              className={destructive ? "h-11 rounded-lg bg-error px-5 text-white hover:bg-error/90" : "h-11 rounded-lg px-5"}
            >
              {isBusy ? "Working…" : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
