import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Skeleton } from "@/components/ui/skeleton";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  highlights: string[];
  children: ReactNode;
};

/** Shared layout for the sign-in and register pages: a form card beside a short explanatory panel. */
export function AuthShell({ eyebrow, title, description, asideTitle, highlights, children }: AuthShellProps) {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="py-12 sm:py-16 lg:py-20">
        <Container className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-14">
          <aside className="relative isolate order-2 overflow-hidden rounded-[28px] bg-secondary px-6 py-8 sm:px-10 sm:py-10 lg:sticky lg:top-28 lg:order-1 lg:py-12">
            <div aria-hidden="true" className="absolute -right-24 -top-28 -z-10 size-[340px] rounded-full border border-accent/15" />
            <div aria-hidden="true" className="absolute -right-10 -top-16 -z-10 size-[220px] rounded-full border border-accent/15" />
            <h2 className="max-w-md font-heading text-balance text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
              {asideTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-foreground/80 sm:text-base">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-success" />
                  {highlight}
                </li>
              ))}
            </ul>
          </aside>

          <section aria-labelledby="auth-title" className="order-1 rounded-[24px] border border-border bg-card p-6 shadow-sm sm:p-8 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
            <h1 id="auth-title" className="mt-2 font-heading text-3xl font-extrabold tracking-[-0.05em] text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-6">{children}</div>
          </section>
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}

/** Placeholder shown while a form reads its URL parameters on the client. */
export function AuthFormSkeleton({ fields }: { fields: number }) {
  return (
    <div aria-hidden="true" className="space-y-4">
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}
