import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account — FixMate",
  description: "Join FixMate as a customer to request repairs, or as a technician to offer your repair services.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Join FixMate"
      title="Create an account"
      description="Choose how you’ll use FixMate. It takes less than a minute."
      asideTitle="One platform for both sides of a repair."
      highlights={[
        "Customers find services by category and request a repair online.",
        "Technicians list their services and manage incoming jobs.",
        "New services are reviewed before they appear publicly.",
      ]}
    >
      {/* The form reads ?role= and ?next= on the client, so the rest of the page can be prerendered. */}
      <Suspense fallback={<AuthFormSkeleton fields={4} />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
