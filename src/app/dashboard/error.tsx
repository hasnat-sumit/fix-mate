"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Error boundary inside the dashboard frame (keeps the sidebar; no public navbar). */
export default function DashboardError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
        <TriangleAlert aria-hidden="true" className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">This page couldn’t load</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Something went wrong while loading this part of your dashboard. Try again, or go back to the overview.</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button type="button" onClick={() => retry()} className="h-11 rounded-full px-6">
          <RotateCcw aria-hidden="true" className="size-4" /> Try again
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full px-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
