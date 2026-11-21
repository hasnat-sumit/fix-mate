import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payment successful — FixMate", robots: { index: false, follow: false } };

export default function PaymentSuccessPage() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="bg-secondary/40 py-16 sm:py-24">
        <Container>
          {/* The session ID is read from the URL in the browser, so the page shell can be prerendered. */}
          <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-lg rounded-2xl" />}>
            <PaymentSuccess />
          </Suspense>
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
