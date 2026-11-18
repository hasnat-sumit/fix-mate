import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <StatusMessage
          icon={SearchX}
          eyebrow="Service not found"
          title="We couldn’t find that service."
          description="The service may have been renamed or the link may be incorrect. Browse all services to find what you need."
          actions={
            <>
              <Button asChild className="h-12 rounded-xl px-6">
                <Link href="/services">
                  <ArrowLeft aria-hidden="true" className="size-4" /> Browse services
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl px-6">
                <Link href="/">Go to homepage</Link>
              </Button>
            </>
          }
        />
      </main>
      <PublicFooter />
    </>
  );
}
