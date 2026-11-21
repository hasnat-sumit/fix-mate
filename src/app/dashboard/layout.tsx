import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PublicNavbar } from "@/components/public-navbar";

export const metadata: Metadata = {
  title: "Dashboard — FixMate",
  // Personal account pages: keep them out of search results.
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <DashboardShell>{children}</DashboardShell>
      </main>
    </>
  );
}
