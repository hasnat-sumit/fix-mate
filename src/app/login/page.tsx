import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — FixMate",
  description: "Sign in to your FixMate account to request repairs or manage your repair services.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Use the email and password you registered with."
      asideTitle="Pick up where you left off."
      highlights={[
        "Request repairs from technicians who list their services on FixMate.",
        "Follow each request from pending to completed.",
        "Pay once the job is done.",
      ]}
    >
      {/* The form reads ?next= on the client, so the rest of the page can be prerendered. */}
      <Suspense fallback={<AuthFormSkeleton fields={2} />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
