import type { Metadata } from "next";
import { ProfilePage } from "@/components/dashboard/profile-form";

export const metadata: Metadata = { title: "Profile — FixMate" };

export default function Page() {
  return (
    <ProfilePage />
  );
}
