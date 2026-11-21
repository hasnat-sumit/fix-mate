"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CircleCheckBig } from "lucide-react";
import { useApiQuery } from "@/components/dashboard/use-api-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import type { Payment } from "@/lib/dashboard-types";
import { formatDateTime, formatPrice } from "@/lib/format";
import { authRoutes, myBookingsHref, withReturnPath } from "@/lib/navigation";

/**
 * /payment/success?session_id=...: asks the server to verify the Checkout Session with Stripe, which saves
 * the payment (once, even on reload or alongside the webhook), then shows the amount and transaction ID.
 */
export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace(withReturnPath(authRoutes.signIn, `/payment/success?session_id=${encodeURIComponent(sessionId)}`));
  }, [isPending, session, sessionId, router]);

  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return <PaymentProblem message="This page needs a payment session from Stripe. If you just paid, open My Bookings to check the job’s payment status." />;
  }
  if (isPending || !session) return <VerifyingSkeleton />;
  if (session.user.role !== "customer") return <PaymentProblem message="Payments are made from customer accounts." />;
  return <VerifiedPayment sessionId={sessionId} />;
}

function VerifiedPayment({ sessionId }: { sessionId: string }) {
  const { data: payment, error, isLoading, reload } = useApiQuery<Payment>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`);

  if (isLoading && !payment) return <VerifyingSkeleton />;
  if (error || !payment) return <PaymentProblem message={error?.message ?? "We couldn’t confirm this payment."} onRetry={reload} />;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
        <CircleCheckBig aria-hidden="true" className="size-8" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-extrabold tracking-[-0.05em] text-foreground">Payment successful</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Thank you! Your payment for <strong className="text-foreground">{payment.serviceTitle}</strong> to {payment.technicianName} is complete.
      </p>
      <dl className="mt-6 space-y-3 rounded-xl bg-secondary/60 p-4 text-left text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Amount paid</dt>
          <dd className="font-heading text-xl font-extrabold tabular-nums text-foreground">{formatPrice(payment.amount)}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="shrink-0 text-muted-foreground">Transaction ID</dt>
          <dd className="min-w-0 break-all text-right">
            <code className="text-xs text-foreground">{payment.transactionId}</code>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Date</dt>
          <dd className="tabular-nums text-foreground">{formatDateTime(payment.paidAt)}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild className="h-11 rounded-full px-6">
          <Link href={myBookingsHref}>Back to My Bookings</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full px-6">
          <Link href="/dashboard/customer/payments">Payment History</Link>
        </Button>
      </div>
    </div>
  );
}

function VerifyingSkeleton() {
  return (
    <div role="status" aria-label="Confirming your payment" className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
      <Skeleton className="mx-auto size-16 rounded-full" />
      <p className="mt-5 text-sm text-muted-foreground">Confirming your payment with Stripe…</p>
      <Skeleton className="mt-6 h-28 rounded-xl" />
    </div>
  );
}

function PaymentProblem({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning/15 text-warning">
        <AlertCircle aria-hidden="true" className="size-8" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">We couldn’t confirm the payment</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {onRetry ? (
          <Button type="button" onClick={onRetry} className="h-11 rounded-full px-6">
            Try again
          </Button>
        ) : null}
        <Button asChild variant="outline" className="h-11 rounded-full px-6">
          <Link href={myBookingsHref}>Go to My Bookings</Link>
        </Button>
      </div>
    </div>
  );
}
