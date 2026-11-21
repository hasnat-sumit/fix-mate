import { DashboardHome } from "@/components/dashboard/dashboard-shell";

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function DashboardPage() {
  return <DashboardHome />;
}
