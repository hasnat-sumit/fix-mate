import Link from "next/link";
import type { Metadata } from "next";
import { CircleX } from "lucide-react";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { myBookingsHref } from "@/lib/navigation";

export const metadata: Metadata = { title: "Payment cancelled — FixMate", robots: { index: false, follow: false } };

/** Stripe sends the customer here after leaving Checkout. Nothing changes in the database. */
export default function PaymentCancelPage() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="bg-secondary/40 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CircleX aria-hidden="true" className="size-8" />
            </span>
            <h1 className="mt-5 font-heading text-3xl font-extrabold tracking-[-0.05em] text-foreground">Payment cancelled</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No problem: you haven’t been charged and your job is still waiting for payment. You can pay whenever you’re ready.
            </p>
            <Button asChild className="mt-6 h-11 rounded-full px-6">
              <Link href={myBookingsHref}>Try Again</Link>
            </Button>
          </div>
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
