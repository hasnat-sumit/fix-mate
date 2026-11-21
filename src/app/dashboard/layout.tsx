import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard — FixMate",
  // Personal account pages: keep them out of search results.
  robots: { index: false, follow: false },
};

/** Dashboard layout: sidebar + top bar, separate from the public navbar and footer. */
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <DashboardShell>{children}</DashboardShell>;
}
