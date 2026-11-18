import type { Metadata } from "next";
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { CustomerCtaSection } from "@/components/about/customer-cta-section";
import { MissionVisionSection } from "@/components/about/mission-vision-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TechnicianCtaSection } from "@/components/home/technician-cta-section";
import { TrustSection } from "@/components/home/trust-section";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";

export const metadata: Metadata = {
  title: "About — FixMate",
  description: "Learn about FixMate's mission to make device and home appliance repair clear, fair and dependable.",
};

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <AboutHeroSection />
        <MissionVisionSection />
        <TrustSection />
        <HowItWorksSection />
        <TechnicianCtaSection />
        <CustomerCtaSection />
      </main>
      <PublicFooter />
    </>
  );
}
