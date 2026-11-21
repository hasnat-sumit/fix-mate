import type { Metadata } from "next";
import { ProfilePage } from "@/components/dashboard/profile-form";

export const metadata: Metadata = { title: "Profile — FixMate" };

// The dashboard shell renders this page only once the browser has the session, so it is not prerendered.
export const instant = false;

export default function Page() {
  return (
    <ProfilePage />
  );
}
