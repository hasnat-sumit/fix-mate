"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Keeps the failure visible in the console until error reporting is added.
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error && typeof error.digest === "string" ? error.digest : null;

  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <StatusMessage
          tone="error"
          icon={TriangleAlert}
          eyebrow="Something went wrong"
          title="We hit an unexpected snag."
          description="This part of FixMate couldn’t load. Try again, or head somewhere safe while we sort it out."
          actions={
            <>
              <Button type="button" onClick={() => retry()} className="h-12 rounded-xl px-6">
                <RotateCcw aria-hidden="true" className="size-4" /> Try again
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl px-6">
                <Link href="/">Back to homepage</Link>
              </Button>
              <Button asChild variant="ghost" className="h-12 rounded-xl px-6">
                <Link href="/services">Browse services</Link>
              </Button>
            </>
          }
        />
        {digest ? (
          <p className="-mt-12 pb-16 text-center text-xs tabular-nums text-muted-foreground">Reference: {digest}</p>
        ) : null}
      </main>
      <PublicFooter />
    </>
  );
}
