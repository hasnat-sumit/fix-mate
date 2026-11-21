import type { Metadata } from "next";
import { AdminTransactions } from "@/components/dashboard/admin-transactions";

export const metadata: Metadata = { title: "Transactions — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return <AdminTransactions />;
}
