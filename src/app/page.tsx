import { CategorySection } from "@/components/home/category-section";
import { FeaturedServicesSection } from "@/components/home/featured-services-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TechnicianCtaSection } from "@/components/home/technician-cta-section";
import { TrustSection } from "@/components/home/trust-section";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";

export default function Home() {
  return (
    <>
      <PublicNavbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedServicesSection />
        <HowItWorksSection />
        <TrustSection />
        <TechnicianCtaSection />
      </main>
      <PublicFooter />
    </>
  );
}
